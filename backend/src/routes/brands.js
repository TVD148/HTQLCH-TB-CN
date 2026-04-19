const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const [brands] = await db.query(
      'SELECT b.*, COUNT(p.id) as product_count FROM brands b LEFT JOIN products p ON p.brand_id = b.id AND p.is_active=1 WHERE b.is_active=1 GROUP BY b.id ORDER BY b.name'
    );
    res.json({ success: true, data: brands });
  } catch (err) { next(err); }
});

module.exports = router;
