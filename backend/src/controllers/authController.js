const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── VALIDATION RULES ────────────────────────────────────────
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

// ─── CONTROLLERS ─────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, address } = req.body;

    // Kiểm tra email đã tồn tại
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, phone || null, address || null]
    );

    const userId = result.insertId;

    // Tạo giỏ hàng cho user mới
    await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);

    // Gửi thông báo chào mừng
    await db.query(
      'INSERT INTO notifications (user_id, title, content, type) VALUES (?, ?, ?, ?)',
      [userId, 'Chào mừng đến TechStore! 🎉', `Cảm ơn ${name} đã đăng ký. Dùng mã WELCOME10 để giảm 10% đơn đầu tiên!`, 'system']
    );

    const [userRow] = await db.query(
      'SELECT id, name, email, role, loyalty_points FROM users WHERE id = ?',
      [userId]
    );

    const token = generateToken(userRow[0]);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: { token, user: userRow[0] },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT id, name, email, password_hash, role, is_active, loyalty_points, avatar_url FROM users WHERE email = ?',
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

    await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);

    const { password_hash, is_active, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: { token, user: safeUser },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, address, avatar_url, loyalty_points, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone || null, address || null, req.user.id]
    );
    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, address, loyalty_points FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, message: 'Cập nhật hồ sơ thành công!', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password || new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(old_password, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  registerValidation,
  loginValidation,
};
