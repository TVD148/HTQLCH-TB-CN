const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware xác thực JWT token
 * Gắn req.user = { id, email, role } nếu hợp lệ
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user còn tồn tại và active
    const [rows] = await db.query(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
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
 * Middleware tùy chọn – không bắt buộc đăng nhập
 * Nếu có token hợp lệ thì gắn req.user, không thì tiếp tục
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await db.query(
        'SELECT id, name, email, role FROM users WHERE id = ? AND is_active = 1',
        [decoded.id]
      );
      if (rows.length) req.user = rows[0];
    }
  } catch (_) {}
  next();
};

module.exports = { verifyToken, optionalAuth };
