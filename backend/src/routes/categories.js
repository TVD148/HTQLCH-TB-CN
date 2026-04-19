const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const [cats] = await db.query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
       WHERE c.is_active = 1
       GROUP BY c.id
       ORDER BY c.sort_order, c.name`
    );
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
});

// GET /api/categories/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Danh mục không tìm thấy' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;
