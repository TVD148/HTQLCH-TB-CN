/**
 * Middleware kiểm tra vai trò (Role-Based Access Control)
 * Sử dụng sau verifyToken
 * @param {...string} roles - Danh sách roles được phép truy cập
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa xác thực' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập. Yêu cầu quyền: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};

module.exports = authorize;
