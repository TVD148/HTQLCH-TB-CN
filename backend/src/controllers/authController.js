const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Tạo JWT token
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// Helper: chuẩn hoá user object cho frontend
const toUserDTO = (row) => ({
  id:             row.ma_nguoi_dung ?? row.id,
  name:           row.ho_ten        ?? row.name,
  email:          row.email,
  role:           row.vai_tro       ?? row.role,
  phone:          row.so_dien_thoai ?? row.phone,
  address:        row.dia_chi       ?? row.address,
  avatar_url:     row.anh_dai_dien  ?? row.avatar_url,
  loyalty_points: row.diem_tich_luy ?? row.loyalty_points ?? 0,
});

// ─── VALIDATION ────────────────────────────────────────────────
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Họ tên không được để trống').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
];

// ─── CONTROLLERS ───────────────────────────────────────────────

/** POST /api/auth/register */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, phone, address, first_name, last_name } = req.body;

    // Tính first_name và last_name tự động nếu frontend gửi full name
    const nameParts   = name.trim().split(/\s+/);
    const fName       = first_name || (nameParts.length >= 1 ? nameParts[nameParts.length - 1] : name);
    const lName       = last_name  || (nameParts.length >= 2 ? nameParts[0] : '');

    const [existing] = await db.query(
      'SELECT ma_nguoi_dung FROM nguoi_dung WHERE email = ?', [email]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const mat_khau_ma_hoa = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO nguoi_dung (ho_ten, ten, ho, email, mat_khau_ma_hoa, so_dien_thoai, dia_chi) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, fName, lName, email, mat_khau_ma_hoa, phone || null, address || null]
    );
    const userId = result.insertId;

    // Tạo giỏ hàng cho user mới
    await db.query('INSERT INTO gio_hang (ma_nguoi_dung) VALUES (?)', [userId]);

    // Thông báo chào mừng
    await db.query(
      `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai)
       VALUES (?, ?, ?, ?)`,
      [userId, 'Chào mừng đến TechStore! 🎉',
       `Cảm ơn ${name} đã đăng ký. Dùng mã WELCOME10 để giảm 10% đơn đầu tiên!`, 'he_thong']
    );

    const [userRow] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, email, vai_tro AS role, diem_tich_luy AS loyalty_points
       FROM nguoi_dung WHERE ma_nguoi_dung = ?`, [userId]
    );

    const token = generateToken(userRow[0]);
    res.status(201).json({ success: true, message: 'Đăng ký thành công!', data: { token, user: userRow[0] } });
  } catch (err) { next(err); }
};

/** POST /api/auth/login */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    const [rows] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, email, mat_khau_ma_hoa AS password_hash,
              vai_tro AS role, trang_thai AS is_active, diem_tich_luy AS loyalty_points, anh_dai_dien AS avatar_url
       FROM nguoi_dung WHERE email = ?`,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = rows[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa, liên hệ admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    await db.query('UPDATE nguoi_dung SET ngay_cap_nhat = NOW() WHERE ma_nguoi_dung = ?', [user.id]);

    const { password_hash, is_active, ...safeUser } = user;
    const token = generateToken(safeUser);
    res.json({ success: true, message: 'Đăng nhập thành công!', data: { token, user: safeUser } });
  } catch (err) { next(err); }
};

/** GET /api/auth/me */
const getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, ten, ho, email, vai_tro AS role,
              so_dien_thoai AS phone, dia_chi AS address, anh_dai_dien AS avatar_url,
              diem_tich_luy AS loyalty_points, ngay_tao AS created_at
       FROM nguoi_dung WHERE ma_nguoi_dung = ?`,
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

/** PUT /api/auth/profile */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    await db.query(
      'UPDATE nguoi_dung SET ho_ten = ?, so_dien_thoai = ?, dia_chi = ? WHERE ma_nguoi_dung = ?',
      [name, phone || null, address || null, req.user.id]
    );
    const [rows] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, email, vai_tro AS role,
              so_dien_thoai AS phone, dia_chi AS address, diem_tich_luy AS loyalty_points
       FROM nguoi_dung WHERE ma_nguoi_dung = ?`,
      [req.user.id]
    );
    res.json({ success: true, message: 'Cập nhật hồ sơ thành công!', data: rows[0] });
  } catch (err) { next(err); }
};

/** PUT /api/auth/change-password */
const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password || new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const [rows] = await db.query(
      'SELECT mat_khau_ma_hoa FROM nguoi_dung WHERE ma_nguoi_dung = ?', [req.user.id]
    );
    const isMatch = await bcrypt.compare(old_password, rows[0].mat_khau_ma_hoa);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE nguoi_dung SET mat_khau_ma_hoa = ? WHERE ma_nguoi_dung = ?', [newHash, req.user.id]);
    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile, changePassword, registerValidation, loginValidation };
