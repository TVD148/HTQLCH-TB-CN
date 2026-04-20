const router = require('express').Router();
const { verifyToken, requireAdmin, requireStaff } = require('../middleware/auth');
const {
  getDashboardOverview, getRevenueReport, getInventoryReport,
  getAllOrders, updateOrderStatus,
  getVouchers, createVoucher, updateVoucher,
  getUsers, toggleUserStatus,
  getInventory, adjustInventory,
} = require('../controllers/adminController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const db = require('../config/database');
const slugify = require('slugify');

// Tất cả admin routes yêu cầu đăng nhập
router.use(verifyToken);

// ─── DASHBOARD ────────────────────────────────────────────────
router.get('/dashboard', requireStaff, getDashboardOverview);

// ─── REPORTS ─────────────────────────────────────────────────
router.get('/reports/revenue',   requireAdmin, getRevenueReport);
router.get('/reports/inventory', requireStaff, getInventoryReport);

// ─── PRODUCTS ────────────────────────────────────────────────
router.post  ('/products',     requireAdmin, createProduct);
router.put   ('/products/:id', requireAdmin, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);

// ─── DANH MUC (CATEGORIES) ───────────────────────────────────
router.get('/categories', requireStaff, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT ma_danh_muc AS id, ten_danh_muc AS name, duong_dan AS slug,
              mo_ta AS description, ma_danh_muc_cha AS parent_id,
              trang_thai AS is_active, thu_tu AS sort_order
       FROM danh_muc ORDER BY thu_tu, ten_danh_muc`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/categories', requireAdmin, async (req, res, next) => {
  try {
    const { name, description, parent_id, sort_order } = req.body;
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    const [r] = await db.query(
      `INSERT INTO danh_muc (ten_danh_muc, duong_dan, mo_ta, ma_danh_muc_cha, thu_tu)
       VALUES (?, ?, ?, ?, ?)`,
      [name, slug, description, parent_id || null, sort_order || 0]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.put('/categories/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, description, parent_id, sort_order, is_active } = req.body;
    await db.query(
      `UPDATE danh_muc SET ten_danh_muc=?, mo_ta=?, ma_danh_muc_cha=?, thu_tu=?, trang_thai=?
       WHERE ma_danh_muc=?`,
      [name, description, parent_id || null, sort_order, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (err) { next(err); }
});

// ─── DON HANG (ORDERS) ────────────────────────────────────────
router.get   ('/orders',              requireStaff, getAllOrders);
router.patch ('/orders/:id/status',   requireStaff, updateOrderStatus);

// ─── MA GIAM GIA (VOUCHERS) ──────────────────────────────────
router.get   ('/vouchers',     requireAdmin, getVouchers);
router.post  ('/vouchers',     requireAdmin, createVoucher);
router.put   ('/vouchers/:id', requireAdmin, updateVoucher);
router.delete('/vouchers/:id', requireAdmin, async (req, res, next) => {
  try {
    await db.query('UPDATE ma_giam_gia SET trang_thai = 0 WHERE ma_voucher = ?', [req.params.id]);
    res.json({ success: true, message: 'Đã vô hiệu hóa voucher' });
  } catch (err) { next(err); }
});

// ─── NGUOI DUNG (USERS) ───────────────────────────────────────
router.get   ('/users',               requireAdmin, getUsers);
router.patch ('/users/:id/toggle',    requireAdmin, toggleUserStatus);

// ─── BAO HANH (WARRANTY) ─────────────────────────────────────
router.get('/warranty', requireStaff, async (req, res, next) => {
  try {
    const { status } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND ycbh.trang_thai = ?'; params.push(status); }

    const [items] = await db.query(
      `SELECT ycbh.ma_bao_hanh AS id, ycbh.so_serial, ycbh.mo_ta_su_co AS issue_description,
              ycbh.trang_thai AS status, ycbh.ghi_chu_xu_ly AS resolution_note,
              ycbh.ngay_tiep_nhan AS received_at, ycbh.ngay_hoan_thanh AS completed_at,
              ctdh.ten_san_pham AS product_name, ctdh.anh_san_pham AS product_thumbnail,
              nd.ho_ten AS customer_name, nd.so_dien_thoai AS phone,
              nv.ho_ten AS staff_name
       FROM yeu_cau_bao_hanh ycbh
       JOIN chi_tiet_don_hang ctdh ON ctdh.ma_chi_tiet  = ycbh.ma_chi_tiet_dh
       JOIN nguoi_dung nd          ON nd.ma_nguoi_dung  = ycbh.ma_nguoi_dung
       LEFT JOIN nguoi_dung nv     ON nv.ma_nguoi_dung  = ycbh.ma_nhan_vien_xu_ly
       ${where} ORDER BY ycbh.ngay_tiep_nhan DESC`,
      params
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.patch('/warranty/:id/status', requireStaff, async (req, res, next) => {
  try {
    const { status, resolution_note } = req.body;
    const validStatuses = ['cho_xu_ly','dang_xu_ly','hoan_thanh','tu_choi'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    await db.query(
      `UPDATE yeu_cau_bao_hanh SET trang_thai=?, ghi_chu_xu_ly=?,
              ma_nhan_vien_xu_ly=?, ngay_hoan_thanh=?
       WHERE ma_bao_hanh=?`,
      [status, resolution_note, req.user.id, status === 'hoan_thanh' ? new Date() : null, req.params.id]
    );
    res.json({ success: true, message: 'Cập nhật bảo hành thành công!' });
  } catch (err) { next(err); }
});

// ─── KHO HANG (INVENTORY) ─────────────────────────────────────
router.get('/inventory', requireStaff, getInventory);

router.get('/inventory/logs', requireStaff, async (req, res, next) => {
  try {
    const { product_id, type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1 = 1';
    const params = [];
    if (product_id) { where += ' AND lsk.ma_san_pham = ?'; params.push(product_id); }
    if (type) { where += ' AND lsk.loai_giao_dich = ?'; params.push(type); }

    const [logs] = await db.query(
      `SELECT lsk.ma_lich_su AS id, lsk.so_luong_bien_dong AS quantity_change,
              lsk.ton_kho_truoc AS stock_before, lsk.ton_kho_sau AS stock_after,
              lsk.loai_giao_dich AS type, lsk.ghi_chu AS note,
              lsk.ma_tham_chieu AS reference_code, lsk.ngay_tao AS created_at,
              sp.ten_san_pham AS product_name, nd.ho_ten AS user_name
       FROM lich_su_kho lsk
       JOIN san_pham sp     ON sp.ma_san_pham   = lsk.ma_san_pham
       LEFT JOIN nguoi_dung nd ON nd.ma_nguoi_dung = lsk.ma_nguoi_dung
       ${where}
       ORDER BY lsk.ngay_tao DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

router.post('/inventory/import', requireStaff, async (req, res, next) => {
  try {
    const { product_id, quantity, note } = req.body;
    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const [p] = await db.query(
      'SELECT so_luong_ton AS stock_quantity FROM san_pham WHERE ma_san_pham = ?', [product_id]
    );
    if (!p.length) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

    const stockBefore = p[0].stock_quantity;
    const stockAfter  = stockBefore + parseInt(quantity);

    await db.query('UPDATE san_pham SET so_luong_ton = ? WHERE ma_san_pham = ?', [stockAfter, product_id]);
    await db.query(
      `INSERT INTO lich_su_kho (ma_san_pham, ma_nguoi_dung, so_luong_bien_dong, ton_kho_truoc, ton_kho_sau, loai_giao_dich, ghi_chu)
       VALUES (?, ?, ?, ?, ?, 'nhap', ?)`,
      [product_id, req.user.id, quantity, stockBefore, stockAfter, note || 'Nhập kho thủ công']
    );

    res.json({ success: true, message: `Nhập kho thành công! Số lượng mới: ${stockAfter}` });
  } catch (err) { next(err); }
});

// ─── DANH GIA (REVIEWS) ───────────────────────────────────────
router.get('/reviews', requireAdmin, async (req, res, next) => {
  try {
    const { is_approved } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (is_approved !== undefined) { where += ' AND dg.da_duyet = ?'; params.push(is_approved); }

    const [reviews] = await db.query(
      `SELECT dg.ma_danh_gia AS id, dg.so_sao AS rating, dg.binh_luan AS comment,
              dg.da_duyet AS is_approved, dg.ngay_tao AS created_at,
              nd.ho_ten AS user_name, sp.ten_san_pham AS product_name
       FROM danh_gia dg
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dg.ma_nguoi_dung
       JOIN san_pham sp   ON sp.ma_san_pham   = dg.ma_san_pham
       ${where} ORDER BY dg.ngay_tao DESC`,
      params
    );
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

router.patch('/reviews/:id/approve', requireAdmin, async (req, res, next) => {
  try {
    await db.query('UPDATE danh_gia SET da_duyet = 1 WHERE ma_danh_gia = ?', [req.params.id]);
    const [r] = await db.query('SELECT ma_san_pham FROM danh_gia WHERE ma_danh_gia = ?', [req.params.id]);
    if (r.length) {
      await db.query(
        `UPDATE san_pham SET danh_gia_tb = (
           SELECT AVG(so_sao) FROM danh_gia WHERE ma_san_pham = ? AND da_duyet = 1
         ) WHERE ma_san_pham = ?`,
        [r[0].ma_san_pham, r[0].ma_san_pham]
      );
    }
    res.json({ success: true, message: 'Đã duyệt đánh giá!' });
  } catch (err) { next(err); }
});

module.exports = router;
