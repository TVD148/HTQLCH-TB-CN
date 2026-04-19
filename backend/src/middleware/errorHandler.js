/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Dữ liệu đã tồn tại (trùng lặp)' });
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ success: false, message: 'Không thể xóa vì dữ liệu đang được tham chiếu' });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message, errors: err.errors });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Đã xảy ra lỗi server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
