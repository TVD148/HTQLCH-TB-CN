const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const [notifs] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
      [req.user.id]
    );
    const [[{ unread }]] = await db.query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    res.json({ success: true, data: notifs, unread });
  } catch (err) { next(err); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (err) { next(err); }
});

module.exports = router;
