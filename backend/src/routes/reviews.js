const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/reviews
router.post('/', async (req, res, next) => {
  try {
    const { product_id, order_item_id, rating, comment } = req.body;
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    // Kiểm tra đã mua hàng chưa
    if (order_item_id) {
      const [check] = await db.query(
        `SELECT oi.id FROM order_items oi
         JOIN orders o ON o.id = oi.order_id
         WHERE oi.id = ? AND o.user_id = ? AND o.status = 'delivered'`,
        [order_item_id, req.user.id]
      );
      if (!check.length) {
        return res.status(403).json({ success: false, message: 'Chỉ khách đã mua hàng mới được đánh giá' });
      }
    }

    await db.query(
      'INSERT INTO reviews (user_id, product_id, order_item_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, product_id, order_item_id || null, rating, comment || null]
    );

    res.status(201).json({ success: true, message: 'Cảm ơn đánh giá của bạn! Đánh giá đang chờ duyệt.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }
    next(err);
  }
});

module.exports = router;
