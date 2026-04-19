const db = require('../config/database');

// Tạo mã đơn hàng
const generateOrderCode = () => {
  const now = new Date();
  const date = now.toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${date}-${rand}`;
};

/**
 * POST /api/orders  - Tạo đơn hàng
 */
const createOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      receiver_name, receiver_phone, shipping_address,
      payment_method = 'cod', note = '',
      voucher_id = null, loyalty_points_used = 0,
    } = req.body;

    if (!receiver_name || !receiver_phone || !shipping_address) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin giao hàng' });
    }

    // Lấy giỏ hàng
    const [cartRows] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    if (!cartRows.length) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const [items] = await conn.query(
      `SELECT ci.id, ci.product_id, ci.quantity, ci.unit_price,
              p.name, p.thumbnail, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cartRows[0].id]
    );

    if (!items.length) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    // Kiểm tra tồn kho toàn bộ
    for (const item of items) {
      if (item.quantity > item.stock_quantity) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${item.name}" chỉ còn ${item.stock_quantity} trong kho`,
        });
      }
    }

    // Tính subtotal
    const subtotal = items.reduce((s, i) => s + parseFloat(i.unit_price) * i.quantity, 0);
    let discountAmount = 0;

    // Xử lý voucher
    if (voucher_id) {
      const [vouchers] = await conn.query(
        'SELECT * FROM vouchers WHERE id = ? AND is_active = 1 AND expired_at >= NOW()',
        [voucher_id]
      );
      if (vouchers.length) {
        const v = vouchers[0];
        if (v.discount_type === 'percent') {
          discountAmount = (subtotal * parseFloat(v.discount_value)) / 100;
          if (v.max_discount_amount) discountAmount = Math.min(discountAmount, parseFloat(v.max_discount_amount));
        } else {
          discountAmount = parseFloat(v.discount_value);
        }
        discountAmount = Math.min(discountAmount, subtotal);
        // Tăng used_count
        await conn.query('UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?', [voucher_id]);
      }
    }

    // Xử lý điểm tích lũy
    let pointsDeduction = 0;
    if (loyalty_points_used > 0) {
      const [userRow] = await conn.query('SELECT loyalty_points FROM users WHERE id = ?', [req.user.id]);
      const availablePoints = userRow[0].loyalty_points;
      const pointsToUse = Math.min(loyalty_points_used, availablePoints);
      pointsDeduction = pointsToUse * 1000; // 1 điểm = 1000đ
      pointsDeduction = Math.min(pointsDeduction, subtotal - discountAmount);
      await conn.query('UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ?',
        [pointsToUse, req.user.id]);
    }

    const shipping_fee = 0; // Miễn phí vận chuyển (có thể tùy chỉnh)
    const totalAmount = subtotal - discountAmount - pointsDeduction + shipping_fee;

    // Tính điểm tích lũy (1% giá trị đơn)
    const pointsEarned = Math.floor(totalAmount / 100000); // 100k = 1 điểm

    const orderCode = generateOrderCode();

    // Tạo đơn hàng
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, order_code, subtotal, discount_amount, shipping_fee, total_amount,
        voucher_id, loyalty_points_used, loyalty_points_earned, status, payment_method,
        receiver_name, receiver_phone, shipping_address, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [req.user.id, orderCode, subtotal, discountAmount, shipping_fee, totalAmount,
       voucher_id || null, loyalty_points_used, pointsEarned, payment_method,
       receiver_name, receiver_phone, shipping_address, note]
    );
    const orderId = orderResult.insertId;

    // Tạo order items
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_thumbnail, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.thumbnail,
         item.unit_price, item.quantity, parseFloat(item.unit_price) * item.quantity]
      );

      // Trừ tồn kho
      const stockBefore = item.stock_quantity;
      const stockAfter = stockBefore - item.quantity;
      await conn.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [stockAfter, item.product_id]);

      // Log xuất kho
      await conn.query(
        `INSERT INTO inventory_logs (product_id, user_id, quantity_change, stock_before, stock_after, type, note, reference_code)
         VALUES (?, ?, ?, ?, ?, 'export', ?, ?)`,
        [item.product_id, req.user.id, -item.quantity, stockBefore, stockAfter,
         `Xuất theo đơn hàng ${orderCode}`, orderCode]
      );
    }

    // Ghi voucher usage
    if (voucher_id && discountAmount > 0) {
      await conn.query(
        'INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_applied) VALUES (?, ?, ?, ?)',
        [voucher_id, req.user.id, orderId, discountAmount]
      );
    }

    // Cộng điểm tích lũy
    if (pointsEarned > 0) {
      await conn.query('UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        [pointsEarned, req.user.id]);
    }

    // Xóa giỏ hàng
    await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cartRows[0].id]);

    // Thông báo
    await conn.query(
      'INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'Đặt hàng thành công! 🎉',
       `Đơn hàng #${orderCode} đã được tạo. Tổng tiền: ${totalAmount.toLocaleString('vi-VN')}đ`,
       'order', orderCode]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: {
        order_id: orderId,
        order_code: orderCode,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        loyalty_points_earned: pointsEarned,
      },
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

/**
 * GET /api/orders  - Đơn hàng của tôi
 */
const getUserOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE o.user_id = ?';
    const params = [req.user.id];
    if (status) { where += ' AND o.status = ?'; params.push(status); }

    const [orders] = await db.query(
      `SELECT o.id, o.order_code, o.total_amount, o.discount_amount,
              o.status, o.payment_method, o.payment_status, o.created_at,
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:id  - Chi tiết đơn hàng
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [orders] = await db.query(
      `SELECT o.*, v.code as voucher_code
       FROM orders o
       LEFT JOIN vouchers v ON v.id = o.voucher_id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?', [id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/orders/:id/cancel  - Hủy đơn hàng
 */
const cancelOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;

    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]
    );
    if (!orders.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    const order = orders[0];
    if (!['pending', 'confirmed'].includes(order.status)) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Không thể hủy đơn hàng ở trạng thái này' });
    }

    // Hoàn kho
    const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    for (const item of items) {
      const [p] = await conn.query('SELECT stock_quantity FROM products WHERE id = ?', [item.product_id]);
      const stockBefore = p[0].stock_quantity;
      const stockAfter = stockBefore + item.quantity;
      await conn.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [stockAfter, item.product_id]);
      await conn.query(
        `INSERT INTO inventory_logs (product_id, user_id, quantity_change, stock_before, stock_after, type, note, reference_code)
         VALUES (?, ?, ?, ?, ?, 'return', 'Hoàn kho do hủy đơn', ?)`,
        [item.product_id, req.user.id, item.quantity, stockBefore, stockAfter, order.order_code]
      );
    }

    // Hoàn điểm và voucher nếu có
    if (order.loyalty_points_used > 0) {
      await conn.query('UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        [order.loyalty_points_used, req.user.id]);
    }

    await conn.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
    await conn.query(
      'INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'Đơn hàng đã hủy', `Đơn hàng #${order.order_code} đã được hủy thành công.`, 'order', order.order_code]
    );

    await conn.commit();
    res.json({ success: true, message: 'Đã hủy đơn hàng thành công!' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder };
