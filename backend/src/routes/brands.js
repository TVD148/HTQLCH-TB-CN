const router = require('express').Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const [brands] = await db.query(
      `SELECT th.ma_thuong_hieu AS id, th.ten_thuong_hieu AS name, th.duong_dan AS slug,
              th.logo AS logo_url, th.quoc_gia AS country, th.trang_thai AS is_active,
              COUNT(sp.ma_san_pham) AS product_count
       FROM thuong_hieu th
       LEFT JOIN san_pham sp ON sp.ma_thuong_hieu = th.ma_thuong_hieu AND sp.trang_thai = 1
       WHERE th.trang_thai = 1
       GROUP BY th.ma_thuong_hieu
       ORDER BY th.ten_thuong_hieu`
    );
    res.json({ success: true, data: brands });
  } catch (err) { next(err); }
});

module.exports = router;
