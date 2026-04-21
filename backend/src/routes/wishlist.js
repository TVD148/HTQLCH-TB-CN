const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT yt.ma_yeu_thich AS id, yt.ngay_them AS created_at,
              sp.ma_san_pham AS product_id, sp.ten_san_pham AS name, sp.duong_dan AS slug,
              sp.gia_goc AS price, sp.gia_khuyen_mai AS sale_price,
              sp.anh_dai_dien AS thumbnail, sp.danh_gia_tb AS avg_rating,
              sp.so_luong_ton AS stock_quantity, sp.noi_bat AS is_featured,
              th.ten_thuong_hieu AS brand_name
       FROM yeu_thich yt
       JOIN san_pham sp ON sp.ma_san_pham = yt.ma_san_pham
       LEFT JOIN thuong_hieu th ON th.ma_thuong_hieu = sp.ma_thuong_hieu
       WHERE yt.ma_nguoi_dung = ? AND sp.trang_thai = 1`,
      [req.user.id]
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// POST /api/wishlist/toggle/:product_id
router.post('/toggle/:product_id', async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const [existing] = await db.query(
      'SELECT ma_yeu_thich FROM yeu_thich WHERE ma_nguoi_dung = ? AND ma_san_pham = ?',
      [req.user.id, product_id]
    );
    if (existing.length) {
      await db.query('DELETE FROM yeu_thich WHERE ma_yeu_thich = ?', [existing[0].ma_yeu_thich]);
      return res.json({ success: true, wishlisted: false, message: 'Đã xóa khỏi yêu thích' });
    } else {
      await db.query(
        'INSERT INTO yeu_thich (ma_nguoi_dung, ma_san_pham) VALUES (?, ?)', [req.user.id, product_id]
      );
      return res.json({ success: true, wishlisted: true, message: 'Đã thêm vào yêu thích' });
    }
  } catch (err) { next(err); }
});

module.exports = router;
