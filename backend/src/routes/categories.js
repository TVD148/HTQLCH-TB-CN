const router = require('express').Router();
const db = require('../config/database');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const [cats] = await db.query(
      `SELECT dm.ma_danh_muc AS id, dm.ten_danh_muc AS name, dm.duong_dan AS slug,
              dm.mo_ta AS description, dm.hinh_anh AS image_url,
              dm.ma_danh_muc_cha AS parent_id, dm.trang_thai AS is_active, dm.thu_tu AS sort_order,
              COUNT(sp.ma_san_pham) AS product_count
       FROM danh_muc dm
       LEFT JOIN san_pham sp ON sp.ma_danh_muc = dm.ma_danh_muc AND sp.trang_thai = 1
       WHERE dm.trang_thai = 1
       GROUP BY dm.ma_danh_muc
       ORDER BY dm.thu_tu, dm.ten_danh_muc`
    );
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
});

// GET /api/categories/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT ma_danh_muc AS id, ten_danh_muc AS name, duong_dan AS slug,
              mo_ta AS description, hinh_anh AS image_url, ma_danh_muc_cha AS parent_id
       FROM danh_muc WHERE ma_danh_muc = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Danh mục không tìm thấy' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;
