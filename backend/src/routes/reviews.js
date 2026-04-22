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
      `INSERT INTO danh_gia (ma_san_pham, ma_nguoi_dung, ma_chi_tiet_dh, so_sao, binh_luan, da_duyet)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [product_id, req.user.id, order_item_id || null, rating, comment || null]
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

// GET /api/reviews/mine — Lấy danh sách đánh giá của người dùng
router.get('/mine', async (req, res, next) => {
  try {
    const [reviews] = await db.query(
      `SELECT dg.ma_chi_tiet_dh AS order_item_id, dg.ma_san_pham AS product_id,
              dg.so_sao AS rating, dg.binh_luan AS comment, dg.ngay_tao AS created_at,
              sp.ten_san_pham AS product_name, sp.anh_dai_dien AS product_thumbnail
       FROM danh_gia dg
       JOIN san_pham sp ON sp.ma_san_pham = dg.ma_san_pham
       WHERE dg.ma_nguoi_dung = ?
       ORDER BY dg.ngay_tao DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

module.exports = router;
