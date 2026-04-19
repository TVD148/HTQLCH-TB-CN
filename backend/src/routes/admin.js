const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getDashboardOverview, getRevenueReport, getInventoryReport,
  getAllOrders, updateOrderStatus,
  getVouchers, createVoucher, updateVoucher,
  getUsers, toggleUserStatus,
} = require('../controllers/adminController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Tất cả admin routes yêu cầu đăng nhập
router.use(verifyToken);

// ─── DASHBOARD ────────────────────────────────────────────────
router.get('/dashboard',  authorize('admin','staff'), getDashboardOverview);

// ─── REPORTS ─────────────────────────────────────────────────
router.get('/reports/revenue',   authorize('admin'),         getRevenueReport);
router.get('/reports/inventory', authorize('admin','staff'), getInventoryReport);

// ─── PRODUCTS (admin only) ────────────────────────────────────
router.post  ('/products',     authorize('admin'), createProduct);
router.put   ('/products/:id', authorize('admin'), updateProduct);
router.delete('/products/:id', authorize('admin'), deleteProduct);

// ─── CATEGORIES ──────────────────────────────────────────────
const db = require('../config/database');
const slugify = require('slugify');

router.get('/categories', authorize('admin','staff'), async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY sort_order, name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/categories', authorize('admin'), async (req, res, next) => {
  try {
    const { name, description, parent_id, sort_order } = req.body;
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    const [r] = await db.query(
      'INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.put('/categories/:id', authorize('admin'), async (req, res, next) => {
  try {
    const { name, description, parent_id, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE categories SET name=?, description=?, parent_id=?, sort_order=?, is_active=? WHERE id=?',
      [name, description, parent_id || null, sort_order, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (err) { next(err); }
});

// ─── ORDERS ──────────────────────────────────────────────────
router.get('/orders',           authorize('admin','staff'), getAllOrders);
router.patch('/orders/:id/status', authorize('admin','staff'), updateOrderStatus);

// ─── VOUCHERS ────────────────────────────────────────────────
router.get  ('/vouchers',     authorize('admin'),         getVouchers);
router.post ('/vouchers',     authorize('admin'),         createVoucher);
router.put  ('/vouchers/:id', authorize('admin'),         updateVoucher);
router.delete('/vouchers/:id', authorize('admin'), async (req,res,next) => {
  try {
    await db.query('UPDATE vouchers SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Đã vô hiệu hóa voucher' });
  } catch (err) { next(err); }
});

// ─── USERS ───────────────────────────────────────────────────
router.get('/users',              authorize('admin'), getUsers);
router.patch('/users/:id/toggle', authorize('admin'), toggleUserStatus);

// ─── WARRANTY ────────────────────────────────────────────────
router.get('/warranty', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { status } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND wr.status = ?'; params.push(status); }

    const [items] = await db.query(
      `SELECT wr.*, oi.product_name, oi.product_thumbnail,
              u.name as customer_name, u.phone,
              s.name as staff_name
       FROM warranty_requests wr
       JOIN order_items oi ON oi.id = wr.order_item_id
       JOIN users u ON u.id = wr.user_id
       LEFT JOIN users s ON s.id = wr.assigned_staff_id
       ${where} ORDER BY wr.received_at DESC`,
      params
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.patch('/warranty/:id/status', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { status, resolution_note } = req.body;
    await db.query(
      'UPDATE warranty_requests SET status=?, resolution_note=?, assigned_staff_id=?, completed_at=? WHERE id=?',
      [status, resolution_note, req.user.id, status === 'completed' ? new Date() : null, req.params.id]
    );
    res.json({ success: true, message: 'Cập nhật bảo hành thành công!' });
  } catch (err) { next(err); }
});

// ─── INVENTORY ───────────────────────────────────────────────
router.get('/inventory/logs', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { product_id, type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1 = 1';
    const params = [];
    if (product_id) { where += ' AND il.product_id = ?'; params.push(product_id); }
    if (type) { where += ' AND il.type = ?'; params.push(type); }

    const [logs] = await db.query(
      `SELECT il.*, p.name as product_name, u.name as user_name
       FROM inventory_logs il
       JOIN products p ON p.id = il.product_id
       LEFT JOIN users u ON u.id = il.user_id
       ${where}
       ORDER BY il.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

// Nhập kho thủ công
router.post('/inventory/import', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { product_id, quantity, note } = req.body;
    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ success:false, message: 'Thiếu thông tin' });
    }

    const [p] = await db.query('SELECT stock_quantity FROM products WHERE id = ?', [product_id]);
    if (!p.length) return res.status(404).json({ success:false, message: 'Không tìm thấy sản phẩm' });

    const stockBefore = p[0].stock_quantity;
    const stockAfter = stockBefore + parseInt(quantity);

    await db.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [stockAfter, product_id]);
    await db.query(
      `INSERT INTO inventory_logs (product_id, user_id, quantity_change, stock_before, stock_after, type, note)
       VALUES (?, ?, ?, ?, ?, 'import', ?)`,
      [product_id, req.user.id, quantity, stockBefore, stockAfter, note || 'Nhập kho thủ công']
    );

    res.json({ success:true, message: `Nhập kho thành công! Số lượng mới: ${stockAfter}` });
  } catch (err) { next(err); }
});

// ─── REVIEWS APPROVAL ────────────────────────────────────────
router.get('/reviews', authorize('admin'), async (req, res, next) => {
  try {
    const { is_approved } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (is_approved !== undefined) { where += ' AND r.is_approved = ?'; params.push(is_approved); }

    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name, p.name as product_name
       FROM reviews r JOIN users u ON u.id=r.user_id JOIN products p ON p.id=r.product_id
       ${where} ORDER BY r.created_at DESC`,
      params
    );
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

router.patch('/reviews/:id/approve', authorize('admin'), async (req, res, next) => {
  try {
    await db.query('UPDATE reviews SET is_approved = 1 WHERE id = ?', [req.params.id]);
    // Cập nhật avg_rating
    const [r] = await db.query('SELECT product_id FROM reviews WHERE id = ?', [req.params.id]);
    if (r.length) {
      await db.query(
        'UPDATE products SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ? AND is_approved = 1) WHERE id = ?',
        [r[0].product_id, r[0].product_id]
      );
    }
    res.json({ success: true, message: 'Đã duyệt đánh giá!' });
  } catch (err) { next(err); }
});

module.exports = router;
