const router = require('express').Router();
const { getProducts, getProductBySlug, compareProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const db = require('../config/database');

// Public routes
router.get('/',          getProducts);
router.get('/compare',   compareProducts);

// ─── Public Flash Sale (không cần auth) ───────────────────────
// GET /api/products/flash-sale/active — Flash sale đang chạy (is_active=1 & chưa hết giờ)
router.get('/flash-sale/active', async (req, res, next) => {
  try {
    const [sales] = await db.query(
      `SELECT fs.ma_flash_sale AS id, fs.ten AS name,
              fs.thoi_gian_bat_dau AS start_time, fs.thoi_gian_ket_thuc AS end_time,
              fs.trang_thai AS is_active,
              COUNT(ctfs.ma_san_pham) AS product_count
       FROM flash_sale fs
       LEFT JOIN chi_tiet_flash_sale ctfs ON ctfs.ma_flash_sale = fs.ma_flash_sale
       WHERE fs.trang_thai = 1 AND fs.thoi_gian_ket_thuc > NOW()
       GROUP BY fs.ma_flash_sale
       ORDER BY fs.thoi_gian_ket_thuc ASC
       LIMIT 1`
    );
    res.json({ success: true, data: sales[0] || null });
  } catch (err) { next(err); }
});

// GET /api/products/flash-sale/:id/products — Sản phẩm trong flash sale (public)
router.get('/flash-sale/:id/products', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT ctfs.ma_chi_tiet AS id, ctfs.gia_flash AS flash_price,
              sp.ma_san_pham AS product_id, sp.ten_san_pham AS product_name,
              sp.anh_dai_dien AS thumbnail, sp.gia_goc AS original_price,
              sp.gia_khuyen_mai AS sale_price
       FROM chi_tiet_flash_sale ctfs
       JOIN san_pham sp ON sp.ma_san_pham = ctfs.ma_san_pham
       WHERE ctfs.ma_flash_sale = ?`, [req.params.id]
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.get('/:slug',     getProductBySlug);

// Admin routes
router.post('/',      verifyToken, authorize('admin'), createProduct);
router.put('/:id',    verifyToken, authorize('admin'), updateProduct);
router.delete('/:id', verifyToken, authorize('admin'), deleteProduct);

module.exports = router;
