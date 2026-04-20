const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware xác thực JWT token
 * Gắn req.user = { ma_nguoi_dung, email, vai_tro } nếu hợp lệ
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user còn tồn tại và đang hoạt động
    const [rows] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, email, vai_tro AS role, trang_thai AS is_active
       FROM nguoi_dung WHERE ma_nguoi_dung = ?`,
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

/**
 * Middleware tuỳ chọn – không bắt buộc đăng nhập
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await db.query(
        `SELECT ma_nguoi_dung AS id, ho_ten AS name, email, vai_tro AS role
         FROM nguoi_dung WHERE ma_nguoi_dung = ? AND trang_thai = 1`,
        [decoded.id]
      );
      if (rows.length) req.user = rows[0];
    }
  } catch (_) {}
  next();
};

/** Chỉ cho phép admin */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thực hiện' });
  }
  next();
};

/** Cho phép admin hoặc staff */
const requireStaff = (req, res, next) => {
  if (!['admin', 'staff'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Không đủ quyền truy cập' });
  }
  next();
};

module.exports = { verifyToken, optionalAuth, requireAdmin, requireStaff };
