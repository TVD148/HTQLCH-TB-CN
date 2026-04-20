const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// POST /api/reviews — Gửi đánh giá sản phẩm
router.post('/', async (req, res, next) => {
  try {
    const { product_id, order_item_id, rating, comment } = req.body;
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    if (order_item_id) {
      const [check] = await db.query(
        `SELECT ctdh.ma_chi_tiet FROM chi_tiet_don_hang ctdh
         JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
         WHERE ctdh.ma_chi_tiet = ? AND dh.ma_nguoi_dung = ? AND dh.trang_thai = 'da_giao'`,
        [order_item_id, req.user.id]
      );
      if (!check.length) {
        return res.status(403).json({ success: false, message: 'Chỉ khách đã mua hàng mới được đánh giá' });
      }
    }

    await db.query(
      `INSERT INTO danh_gia (ma_nguoi_dung, ma_san_pham, ma_chi_tiet_dh, so_sao, binh_luan)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, product_id, order_item_id || null, rating, comment || null]
    );

    // Cập nhật điểm đánh giá trung bình
    await db.query(
      `UPDATE san_pham SET danh_gia_tb = (
         SELECT AVG(so_sao) FROM danh_gia WHERE ma_san_pham = ? AND da_duyet = 1
       ) WHERE ma_san_pham = ?`,
      [product_id, product_id]
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
