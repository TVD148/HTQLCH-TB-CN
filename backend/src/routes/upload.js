const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Đảm bảo thư mục tồn tại
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Chỉ cho phép file ảnh (jpg, png, webp, gif)'));
  },
});

// POST /api/upload/image  — chỉ admin mới dùng được
router.post('/image', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Không có file nào được upload' });

  // Trả về URL có thể truy cập từ frontend
  const url = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router;
