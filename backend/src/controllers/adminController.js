const db = require('../config/database');

/** GET /api/admin/reports/revenue */
const getRevenueReport = async (req, res, next) => {
  try {
    const { from, to, group_by = 'day' } = req.query;
    const fromDate = from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
    const toDate   = to   || new Date().toISOString().slice(0,10);

    const dateFormat = group_by === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const [revenueChart] = await db.query(
      `SELECT DATE_FORMAT(created_at, '${dateFormat}') as period,
              COUNT(*) as order_count,
              SUM(total_amount) as revenue
       FROM orders
       WHERE status IN ('delivered','confirmed','shipping')
       AND DATE(created_at) BETWEEN ? AND ?
       GROUP BY period
       ORDER BY period`,
      [fromDate, toDate]
    );

    const [summary] = await db.query(
      `SELECT COUNT(*) as total_orders,
              SUM(total_amount) as total_revenue,
              AVG(total_amount) as avg_order_value,
              COUNT(DISTINCT user_id) as unique_customers
       FROM orders
       WHERE status IN ('delivered','confirmed','shipping')
       AND DATE(created_at) BETWEEN ? AND ?`,
      [fromDate, toDate]
    );

    const [topProducts] = await db.query(
      `SELECT p.id, p.name, p.thumbnail,
              SUM(oi.quantity) as total_sold,
              SUM(oi.subtotal) as total_revenue
       FROM order_items oi
       JOIN orders o  ON o.id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.status IN ('delivered','confirmed','shipping')
       AND DATE(o.created_at) BETWEEN ? AND ?
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 10`,
      [fromDate, toDate]
    );

    const [statusBreakdown] = await db.query(
      `SELECT status, COUNT(*) as count, SUM(total_amount) as amount
       FROM orders
       WHERE DATE(created_at) BETWEEN ? AND ?
       GROUP BY status`,
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
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/reports/inventory */
const getInventoryReport = async (req, res, next) => {
  try {
    const [overview] = await db.query(
      `SELECT COUNT(*) as total_products,
              SUM(stock_quantity * COALESCE(sale_price, price)) as inventory_value,
              SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
              SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= min_stock_alert THEN 1 ELSE 0 END) as low_stock
       FROM products WHERE is_active = 1`
    );

    const [lowStock] = await db.query(
      `SELECT p.id, p.name, p.thumbnail, p.stock_quantity, p.min_stock_alert,
              c.name as category_name, b.name as brand_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       JOIN brands b ON b.id = p.brand_id
       WHERE p.is_active = 1 AND p.stock_quantity <= p.min_stock_alert
       ORDER BY p.stock_quantity ASC
       LIMIT 20`
    );

    const [topSelling] = await db.query(
      `SELECT p.id, p.name, p.thumbnail,
              SUM(oi.quantity) as total_sold
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.status NOT IN ('cancelled','refunded')
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: { overview: overview[0], low_stock: lowStock, top_selling: topSelling },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/reports/overview */
const getDashboardOverview = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    const month = new Date().toISOString().slice(0,7);

    const [[todayStats]] = await db.query(
      `SELECT COUNT(*) as orders_today,
              COALESCE(SUM(total_amount), 0) as revenue_today
       FROM orders
       WHERE DATE(created_at) = ? AND status NOT IN ('cancelled')`,
      [today]
    );

    const [[monthStats]] = await db.query(
      `SELECT COUNT(*) as orders_month,
              COALESCE(SUM(total_amount), 0) as revenue_month
       FROM orders
       WHERE DATE_FORMAT(created_at,'%Y-%m') = ? AND status NOT IN ('cancelled')`,
      [month]
    );

    const [[userStats]] = await db.query(
      `SELECT COUNT(*) as total_users,
              SUM(CASE WHEN DATE(created_at) = ? THEN 1 ELSE 0 END) as new_today
       FROM users WHERE role = 'user'`,
      [today]
    );

    const [[productStats]] = await db.query(
      `SELECT COUNT(*) as total_products,
              SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock
       FROM products WHERE is_active = 1`
    );

    const [recentOrders] = await db.query(
      `SELECT o.id, o.order_code, o.total_amount, o.status, o.created_at,
              u.name as customer_name
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        today:        { ...todayStats },
        this_month:   { ...monthStats },
        users:        { ...userStats },
        products:     { ...productStats },
        recent_orders: recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/orders */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let where = 'WHERE 1=1';

    if (status) { where += ' AND o.status = ?'; params.push(status); }
    if (search) {
      where += ' AND (o.order_code LIKE ? OR u.name LIKE ? OR o.receiver_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [orders] = await db.query(
      `SELECT o.id, o.order_code, o.total_amount, o.discount_amount,
              o.status, o.payment_method, o.payment_status,
              o.receiver_name, o.receiver_phone, o.created_at,
              u.name as customer_name, u.email as customer_email,
              COUNT(oi.id) as item_count
       FROM orders o
       JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT o.id) as total FROM orders o JOIN users u ON u.id=o.user_id ${where}`,
      params
    );

    res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/limit) } });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/orders/:id/status */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending','confirmed','shipping','delivered','cancelled','refunded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const statusLabels = {
      confirmed: 'đã được xác nhận',
      shipping: 'đang được vận chuyển',
      delivered: 'đã giao thành công',
      cancelled: 'đã bị hủy',
    };

    if (statusLabels[status]) {
      await db.query(
        'INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES (?, ?, ?, ?, ?)',
        [orders[0].user_id, `Cập nhật đơn hàng #${orders[0].order_code}`,
         `Đơn hàng của bạn ${statusLabels[status]}.`, 'order', orders[0].order_code]
      );
    }

    // Nếu giao thành công, cộng điểm tích lũy đã hứa
    if (status === 'delivered' && orders[0].loyalty_points_earned > 0) {
      await db.query('UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        [orders[0].loyalty_points_earned, orders[0].user_id]);
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
  } catch (err) {
    next(err);
  }
};

/** GET+POST+PUT /api/admin/vouchers */
const getVouchers = async (req, res, next) => {
  try {
    const [vouchers] = await db.query('SELECT * FROM vouchers ORDER BY created_at DESC');
    res.json({ success: true, data: vouchers });
  } catch (err) { next(err); }
};

const createVoucher = async (req, res, next) => {
  try {
    const { code, name, description, discount_type, discount_value, max_discount_amount,
            min_order_value, max_uses, max_uses_per_user, start_date, expired_at } = req.body;

    if (!code || !discount_type || !discount_value || !expired_at) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const [existing] = await db.query('SELECT id FROM vouchers WHERE code = ?', [code.toUpperCase()]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Mã voucher đã tồn tại' });
    }

    const [result] = await db.query(
      `INSERT INTO vouchers (code, name, description, discount_type, discount_value, max_discount_amount,
        min_order_value, max_uses, max_uses_per_user, start_date, expired_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code.toUpperCase(), name, description, discount_type, discount_value,
       max_discount_amount || null, min_order_value || 0, max_uses || 1,
       max_uses_per_user || 1, start_date || new Date(), expired_at]
    );

    const [voucher] = await db.query('SELECT * FROM vouchers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Tạo voucher thành công!', data: voucher[0] });
  } catch (err) { next(err); }
};

const updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, discount_type, discount_value, max_discount_amount, min_order_value,
            max_uses, max_uses_per_user, is_active, expired_at } = req.body;
    await db.query(
      `UPDATE vouchers SET name=?, discount_type=?, discount_value=?, max_discount_amount=?,
        min_order_value=?, max_uses=?, max_uses_per_user=?, is_active=?, expired_at=?
       WHERE id = ?`,
      [name, discount_type, discount_value, max_discount_amount || null,
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
    let where = "WHERE role != 'admin'";
    const params = [];
    if (role) { where += ' AND role = ?'; params.push(role); }
    if (search) {
      where += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const ORDER_MAP = {
      name_asc:  'COALESCE(first_name, SUBSTRING_INDEX(name, " ", -1)) ASC',
      name_desc: 'COALESCE(first_name, SUBSTRING_INDEX(name, " ", -1)) DESC',
      newest:    'created_at DESC',
      oldest:    'created_at ASC',
      points:    'loyalty_points DESC',
    };
    const orderBy = ORDER_MAP[sort] || ORDER_MAP.name_asc;

    const [users] = await db.query(
      `SELECT id, name, first_name, last_name, email, role, phone, loyalty_points, is_active, created_at
       FROM users ${where}
       ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [id]);
    res.json({ success: true, message: 'Cập nhật trạng thái tài khoản thành công!' });
  } catch (err) { next(err); }
};

module.exports = {
  getRevenueReport, getInventoryReport, getDashboardOverview,
  getAllOrders, updateOrderStatus,
  getVouchers, createVoucher, updateVoucher,
  getUsers, toggleUserStatus,
};
