const db = require('../config/database');

/** GET /api/admin/reports/revenue */
const getRevenueReport = async (req, res, next) => {
  try {
    const { from, to, group_by = 'day' } = req.query;
    const fromDate = from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
    const toDate   = to   || new Date().toISOString().slice(0,10);

    const dateFormat = group_by === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const [revenueChart] = await db.query(
      `SELECT DATE_FORMAT(ngay_tao, '${dateFormat}') AS period,
              COUNT(*) AS order_count,
              SUM(tong_tien) AS revenue
       FROM don_hang
       WHERE trang_thai IN ('da_giao','da_xac_nhan','dang_giao')
       AND DATE(ngay_tao) BETWEEN ? AND ?
       GROUP BY period ORDER BY period`,
      [fromDate, toDate]
    );

    const [summary] = await db.query(
      `SELECT COUNT(*) AS total_orders,
              SUM(tong_tien) AS total_revenue,
              AVG(tong_tien) AS avg_order_value,
              COUNT(DISTINCT ma_nguoi_dung) AS unique_customers
       FROM don_hang
       WHERE trang_thai IN ('da_giao','da_xac_nhan','dang_giao')
       AND DATE(ngay_tao) BETWEEN ? AND ?`,
      [fromDate, toDate]
    );

    const [topProducts] = await db.query(
      `SELECT sp.ma_san_pham AS id, sp.ten_san_pham AS name, sp.anh_dai_dien AS thumbnail,
              SUM(ctdh.so_luong) AS total_sold,
              SUM(ctdh.thanh_tien) AS total_revenue
       FROM chi_tiet_don_hang ctdh
       JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
       JOIN san_pham sp ON sp.ma_san_pham = ctdh.ma_san_pham
       WHERE dh.trang_thai IN ('da_giao','da_xac_nhan','dang_giao')
       AND DATE(dh.ngay_tao) BETWEEN ? AND ?
       GROUP BY sp.ma_san_pham
       ORDER BY total_sold DESC LIMIT 10`,
      [fromDate, toDate]
    );

    const [statusBreakdown] = await db.query(
      `SELECT trang_thai AS status, COUNT(*) AS count, SUM(tong_tien) AS amount
       FROM don_hang WHERE DATE(ngay_tao) BETWEEN ? AND ?
       GROUP BY trang_thai`,
      [fromDate, toDate]
    );

    res.json({
      success: true,
      data: {
        period: { from: fromDate, to: toDate },
        summary: summary[0],
        revenue_chart: revenueChart,
        top_products: topProducts,
        status_breakdown: statusBreakdown,
      },
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/reports/inventory */
const getInventoryReport = async (req, res, next) => {
  try {
    const [overview] = await db.query(
      `SELECT COUNT(*) AS total_products,
              SUM(so_luong_ton * COALESCE(gia_khuyen_mai, gia_goc)) AS inventory_value,
              SUM(CASE WHEN so_luong_ton = 0 THEN 1 ELSE 0 END) AS out_of_stock,
              SUM(CASE WHEN so_luong_ton > 0 AND so_luong_ton <= canh_bao_ton_toi_thieu THEN 1 ELSE 0 END) AS low_stock
       FROM san_pham WHERE trang_thai = 1`
    );

    const [lowStock] = await db.query(
      `SELECT sp.ma_san_pham AS id, sp.ten_san_pham AS name, sp.anh_dai_dien AS thumbnail,
              sp.so_luong_ton AS stock_quantity, sp.canh_bao_ton_toi_thieu AS min_stock_alert,
              dm.ten_danh_muc AS category_name, th.ten_thuong_hieu AS brand_name
       FROM san_pham sp
       JOIN danh_muc dm  ON dm.ma_danh_muc    = sp.ma_danh_muc
       JOIN thuong_hieu th ON th.ma_thuong_hieu = sp.ma_thuong_hieu
       WHERE sp.trang_thai = 1 AND sp.so_luong_ton <= sp.canh_bao_ton_toi_thieu
       ORDER BY sp.so_luong_ton ASC LIMIT 20`
    );

    const [topSelling] = await db.query(
      `SELECT sp.ma_san_pham AS id, sp.ten_san_pham AS name, sp.anh_dai_dien AS thumbnail,
              SUM(ctdh.so_luong) AS total_sold
       FROM chi_tiet_don_hang ctdh
       JOIN san_pham sp ON sp.ma_san_pham = ctdh.ma_san_pham
       JOIN don_hang dh ON dh.ma_don_hang  = ctdh.ma_don_hang
       WHERE dh.trang_thai NOT IN ('da_huy','hoan_tien')
       GROUP BY sp.ma_san_pham ORDER BY total_sold DESC LIMIT 10`
    );

    res.json({ success: true, data: { overview: overview[0], low_stock: lowStock, top_selling: topSelling } });
  } catch (err) { next(err); }
};

/** GET /api/admin/reports/overview */
const getDashboardOverview = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    const month = new Date().toISOString().slice(0,7);

    const [[todayStats]] = await db.query(
      `SELECT COUNT(*) AS orders_today,
              COALESCE(SUM(tong_tien), 0) AS revenue_today
       FROM don_hang WHERE DATE(ngay_tao) = ? AND trang_thai != 'da_huy'`,
      [today]
    );
    const [[monthStats]] = await db.query(
      `SELECT COUNT(*) AS orders_month,
              COALESCE(SUM(tong_tien), 0) AS revenue_month
       FROM don_hang WHERE DATE_FORMAT(ngay_tao,'%Y-%m') = ? AND trang_thai != 'da_huy'`,
      [month]
    );
    const [[userStats]] = await db.query(
      `SELECT COUNT(*) AS total_users,
              SUM(CASE WHEN DATE(ngay_tao) = ? THEN 1 ELSE 0 END) AS new_today
       FROM nguoi_dung WHERE vai_tro = 'user'`,
      [today]
    );
    const [[productStats]] = await db.query(
      `SELECT COUNT(*) AS total_products,
              SUM(CASE WHEN so_luong_ton = 0 THEN 1 ELSE 0 END) AS out_of_stock
       FROM san_pham WHERE trang_thai = 1`
    );
    const [recentOrders] = await db.query(
      `SELECT dh.ma_don_hang AS id, dh.ma_code AS order_code, dh.tong_tien AS total_amount,
              dh.trang_thai AS status, dh.ngay_tao AS created_at,
              nd.ho_ten AS customer_name
       FROM don_hang dh
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dh.ma_nguoi_dung
       ORDER BY dh.ngay_tao DESC LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        today:         { ...todayStats },
        this_month:    { ...monthStats },
        users:         { ...userStats },
        products:      { ...productStats },
        recent_orders: recentOrders,
      },
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/orders */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let where = 'WHERE 1=1';

    if (status) { where += ' AND dh.trang_thai = ?'; params.push(status); }
    if (search) {
      where += ' AND (dh.ma_code LIKE ? OR nd.ho_ten LIKE ? OR dh.sdt_nguoi_nhan LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [orders] = await db.query(
      `SELECT dh.ma_don_hang AS id, dh.ma_code AS order_code,
              dh.tong_tien AS total_amount, dh.so_tien_giam AS discount_amount,
              dh.trang_thai AS status, dh.phuong_thuc_tt AS payment_method,
              dh.trang_thai_tt AS payment_status, dh.ten_nguoi_nhan AS receiver_name,
              dh.sdt_nguoi_nhan AS receiver_phone, dh.ngay_tao AS created_at,
              nd.ho_ten AS customer_name, nd.email AS customer_email,
              COUNT(ctdh.ma_chi_tiet) AS item_count
       FROM don_hang dh
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dh.ma_nguoi_dung
       LEFT JOIN chi_tiet_don_hang ctdh ON ctdh.ma_don_hang = dh.ma_don_hang
       ${where}
       GROUP BY dh.ma_don_hang
       ORDER BY dh.ngay_tao DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT dh.ma_don_hang) AS total
       FROM don_hang dh JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dh.ma_nguoi_dung ${where}`,
      params
    );

    res.json({
      success: true, data: orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/limit) },
    });
  } catch (err) { next(err); }
};

/** PATCH /api/admin/orders/:id/status */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['cho_xac_nhan','da_xac_nhan','dang_giao','da_giao','da_huy','hoan_tien'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const [orders] = await db.query('SELECT * FROM don_hang WHERE ma_don_hang = ?', [id]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    // Map trạng thái đơn → trạng thái thanh toán tự động
    const paymentStatusMap = {
      da_giao:  'da_tt',          // Đã giao  → Đã thanh toán
      hoan_tien: 'da_hoan_tien',  // Hoàn tiền → Đã hoàn tiền
      // Mọi trạng thái khác → Chưa thanh toán
    };
    const newPaymentStatus = paymentStatusMap[status] || 'chua_tt';

    await db.query(
      'UPDATE don_hang SET trang_thai = ?, trang_thai_tt = ? WHERE ma_don_hang = ?',
      [status, newPaymentStatus, id]
    );

    const statusLabels = {
      cho_xac_nhan: 'đang chờ xác nhận',
      da_xac_nhan:  'đã được xác nhận',
      dang_giao:    'đang được vận chuyển',
      da_giao:      'đã giao thành công',
      da_huy:       'đã bị hủy',
      hoan_tien:    'đã được hoàn tiền',
    };

    // Gửi thông báo đến khách hàng
    if (statusLabels[status]) {
      const extraMsg = status === 'da_giao'
        ? ' Thanh toán đã được xác nhận. Cảm ơn bạn đã mua hàng! 🎉'
        : '';
      await db.query(
        `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
         VALUES (?, ?, ?, ?, ?)`,
        [orders[0].ma_nguoi_dung,
         `Cập nhật đơn hàng #${orders[0].ma_code}`,
         `Đơn hàng của bạn ${statusLabels[status]}.${extraMsg}`,
         'don_hang', orders[0].ma_code]
      );
    }

    // Cộng điểm tích lũy khi giao thành công
    if (status === 'da_giao' && orders[0].diem_tich_duoc > 0) {
      await db.query(
        'UPDATE nguoi_dung SET diem_tich_luy = diem_tich_luy + ? WHERE ma_nguoi_dung = ?',
        [orders[0].diem_tich_duoc, orders[0].ma_nguoi_dung]
      );
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
  } catch (err) { next(err); }
};

/** GET/POST/PUT /api/admin/vouchers */
const getVouchers = async (req, res, next) => {
  try {
    const [vouchers] = await db.query(`
      SELECT ma_voucher AS id, ma_code AS code, ten_voucher AS name, mo_ta AS description,
             loai_giam AS discount_type, loai_voucher AS voucher_type, gia_tri_giam AS discount_value,
             giam_toi_da AS max_discount_amount, don_hang_toi_thieu AS min_order_value,
             so_lan_toi_da AS max_uses, da_su_dung AS used_count,
             gioi_han_moi_nguoi AS max_uses_per_user, trang_thai AS is_active,
             ngay_bat_dau AS start_date, ngay_het_han AS expired_at, ngay_tao AS created_at
      FROM ma_giam_gia ORDER BY ngay_tao DESC`);
    res.json({ success: true, data: vouchers });
  } catch (err) { next(err); }
};

const createVoucher = async (req, res, next) => {
  try {
    const { code, name, description, voucher_type = 'product', discount_type, discount_value, max_discount_amount,
            min_order_value, max_uses, max_uses_per_user, start_date, expired_at } = req.body;

    if (!code || !discount_type || !discount_value || !expired_at) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const [existing] = await db.query('SELECT ma_voucher FROM ma_giam_gia WHERE ma_code = ?', [code.toUpperCase()]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Mã voucher đã tồn tại' });
    }

    const [result] = await db.query(
      `INSERT INTO ma_giam_gia
         (ma_code, ten_voucher, mo_ta, loai_giam, loai_voucher, gia_tri_giam, giam_toi_da,
          don_hang_toi_thieu, so_lan_toi_da, gioi_han_moi_nguoi, ngay_bat_dau, ngay_het_han)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code.toUpperCase(), name, description, discount_type, voucher_type, discount_value,
       max_discount_amount || null, min_order_value || 0, max_uses || 1,
       max_uses_per_user || 1, start_date || new Date(), expired_at]
    );

    const [voucher] = await db.query(`
      SELECT ma_voucher AS id, ma_code AS code, ten_voucher AS name
      FROM ma_giam_gia WHERE ma_voucher = ?`, [result.insertId]);
    res.status(201).json({ success: true, message: 'Tạo voucher thành công!', data: voucher[0] });
  } catch (err) { next(err); }
};

const updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, voucher_type, discount_type, discount_value, max_discount_amount, min_order_value,
            max_uses, max_uses_per_user, is_active, expired_at } = req.body;
    await db.query(
      `UPDATE ma_giam_gia SET
         ten_voucher=?, loai_giam=?, loai_voucher=?, gia_tri_giam=?, giam_toi_da=?,
         don_hang_toi_thieu=?, so_lan_toi_da=?, gioi_han_moi_nguoi=?, trang_thai=?, ngay_het_han=?
       WHERE ma_voucher = ?`,
      [name, discount_type, voucher_type || 'product', discount_value, max_discount_amount || null,
       min_order_value, max_uses, max_uses_per_user, is_active, expired_at, id]
    );
    res.json({ success: true, message: 'Cập nhật voucher thành công!' });
  } catch (err) { next(err); }
};

/** GET /api/admin/users */
const getUsers = async (req, res, next) => {
  try {
    const { search, role, sort = 'name_asc', page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;
    let where = "WHERE vai_tro != 'admin'";
    const params = [];
    if (role)   { where += ' AND vai_tro = ?'; params.push(role); }
    if (search) {
      where += ' AND (ho_ten LIKE ? OR email LIKE ? OR so_dien_thoai LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const ORDER_MAP = {
      name_asc:  'COALESCE(ten, SUBSTRING_INDEX(ho_ten, " ", -1)) ASC',
      name_desc: 'COALESCE(ten, SUBSTRING_INDEX(ho_ten, " ", -1)) DESC',
      newest:    'ngay_tao DESC',
      oldest:    'ngay_tao ASC',
      points:    'diem_tich_luy DESC',
    };
    const orderBy = ORDER_MAP[sort] || ORDER_MAP.name_asc;

    const [users] = await db.query(
      `SELECT ma_nguoi_dung AS id, ho_ten AS name, ten, ho, email,
              vai_tro AS role, so_dien_thoai AS phone,
              diem_tich_luy AS loyalty_points, trang_thai AS is_active, ngay_tao AS created_at
       FROM nguoi_dung ${where}
       ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE nguoi_dung SET trang_thai = NOT trang_thai WHERE ma_nguoi_dung = ?', [id]);
    res.json({ success: true, message: 'Cập nhật trạng thái tài khoản thành công!' });
  } catch (err) { next(err); }
};

/** GET /api/admin/inventory */
const getInventory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE sp.trang_thai = 1';
    const params = [];
    if (search) { where += ' AND sp.ten_san_pham LIKE ?'; params.push(`%${search}%`); }

    const [products] = await db.query(
      `SELECT sp.ma_san_pham AS id, sp.ten_san_pham AS name,
              sp.anh_dai_dien AS thumbnail, sp.so_luong_ton AS stock_quantity,
              sp.canh_bao_ton_toi_thieu AS min_stock_alert,
              sp.gia_goc AS price, sp.gia_khuyen_mai AS sale_price,
              dm.ten_danh_muc AS category_name, th.ten_thuong_hieu AS brand_name
       FROM san_pham sp
       JOIN danh_muc dm  ON dm.ma_danh_muc    = sp.ma_danh_muc
       JOIN thuong_hieu th ON th.ma_thuong_hieu = sp.ma_thuong_hieu
       ${where} ORDER BY sp.so_luong_ton ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: products });
  } catch (err) { next(err); }
};

const adjustInventory = async (req, res, next) => {
  try {
    const { product_id, quantity_change, type, note, reference_code } = req.body;
    if (!product_id || !quantity_change || !type) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const [products] = await db.query(
      'SELECT so_luong_ton AS stock_quantity FROM san_pham WHERE ma_san_pham = ?', [product_id]
    );
    if (!products.length) return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });

    const stockBefore = products[0].stock_quantity;
    const stockAfter  = stockBefore + quantity_change;
    if (stockAfter < 0) return res.status(400).json({ success: false, message: 'Số lượng tồn kho không thể âm' });

    await db.query('UPDATE san_pham SET so_luong_ton = ? WHERE ma_san_pham = ?', [stockAfter, product_id]);
    await db.query(
      `INSERT INTO lich_su_kho (ma_san_pham, ma_nguoi_dung, so_luong_bien_dong, ton_kho_truoc, ton_kho_sau, loai_giao_dich, ghi_chu, ma_tham_chieu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_id, req.user.id, quantity_change, stockBefore, stockAfter, type, note || null, reference_code || null]
    );

    res.json({ success: true, message: 'Đã cập nhật tồn kho!', data: { stock_before: stockBefore, stock_after: stockAfter } });
  } catch (err) { next(err); }
};

module.exports = {
  getRevenueReport, getInventoryReport, getDashboardOverview,
  getAllOrders, updateOrderStatus,
  getVouchers, createVoucher, updateVoucher,
  getUsers, toggleUserStatus,
  getInventory, adjustInventory,
};
