const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT w.id, w.created_at, p.id as product_id, p.name, p.slug,
              p.price, p.sale_price, p.thumbnail, p.avg_rating, p.stock_quantity
       FROM wishlists w
       JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/toggle/:product_id', async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const [existing] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    if (existing.length) {
      await db.query('DELETE FROM wishlists WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, wishlisted: false, message: 'Đã xóa khỏi yêu thích' });
    } else {
      await db.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
      return res.json({ success: true, wishlisted: true, message: 'Đã thêm vào yêu thích' });
    }
  } catch (err) { next(err); }
});

module.exports = router;
