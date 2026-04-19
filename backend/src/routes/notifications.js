const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/notifications
router.get('/', async (req, res, next) => {
  try {
    const [notifs] = await db.query(
      `SELECT ma_thong_bao AS id, tieu_de AS title, noi_dung AS content,
              loai AS type, da_doc AS is_read, ma_tham_chieu AS ref_id, ngay_tao AS created_at
       FROM thong_bao WHERE ma_nguoi_dung = ? ORDER BY ngay_tao DESC LIMIT 30`,
      [req.user.id]
    );
    const [[{ unread }]] = await db.query(
      'SELECT COUNT(*) AS unread FROM thong_bao WHERE ma_nguoi_dung = ? AND da_doc = 0',
      [req.user.id]
    );
    res.json({ success: true, data: notifs, unread });
  } catch (err) { next(err); }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res, next) => {
  try {
    await db.query('UPDATE thong_bao SET da_doc = 1 WHERE ma_nguoi_dung = ?', [req.user.id]);
    res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (err) { next(err); }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res, next) => {
  try {
    await db.query(
      'UPDATE thong_bao SET da_doc = 1 WHERE ma_thong_bao = ? AND ma_nguoi_dung = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
