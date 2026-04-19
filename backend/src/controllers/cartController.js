const db = require('../config/database');

/**
 * GET /api/cart  - Lấy giỏ hàng của user
 */
const getCart = async (req, res, next) => {
  try {
    const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    if (!cart.length) {
      return res.json({ success: true, data: { items: [], subtotal: 0, item_count: 0 } });
    }

    const [items] = await db.query(
      `SELECT ci.id, ci.quantity, ci.unit_price,
              p.id as product_id, p.name, p.slug, p.thumbnail,
              p.price as current_price, p.sale_price, p.stock_quantity,
              (ci.quantity * ci.unit_price) as subtotal
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ? AND p.is_active = 1`,
      [cart[0].id]
    );

    const subtotal = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
    const item_count = items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({ success: true, data: { items, subtotal, item_count } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cart/add  - Thêm sản phẩm vào giỏ
 */
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    // Kiểm tra sản phẩm & tồn kho
    const [products] = await db.query(
      'SELECT id, price, sale_price, stock_quantity FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    const product = products[0];
    const unitPrice = product.sale_price || product.price;

    // Lấy cart của user
    const [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    let cartId;
    if (!cartRows.length) {
      const [r] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [req.user.id]);
      cartId = r.insertId;
    } else {
      cartId = cartRows[0].id;
    }

    // Kiểm tra đã có trong giỏ chưa
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    const newQty = existing.length ? existing[0].quantity + quantity : quantity;

    if (newQty > product.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho`,
      });
    }

    if (existing.length) {
      await db.query(
        'UPDATE cart_items SET quantity = ?, unit_price = ? WHERE id = ?',
        [newQty, unitPrice, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [cartId, product_id, quantity, unitPrice]
      );
    }

    // Trả về số lượng trong giỏ
    const [countResult] = await db.query(
      'SELECT SUM(quantity) as item_count FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    res.json({
      success: true,
      message: 'Đã thêm vào giỏ hàng!',
      data: { item_count: countResult[0].item_count || 0 },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/cart/items/:id  - Cập nhật số lượng
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ' });
    }

    // Verify item thuộc về giỏ của user
    const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    const [item] = await db.query(
      'SELECT ci.*, p.stock_quantity FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.id = ? AND ci.cart_id = ?',
      [id, cart[0]?.id]
    );

    if (!item.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ' });
    }

    if (quantity > item[0].stock_quantity) {
      return res.status(400).json({ success: false, message: `Chỉ còn ${item[0].stock_quantity} sản phẩm` });
    }

    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ success: true, message: 'Đã cập nhật số lượng' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/items/:id  - Xóa item khỏi giỏ
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [id, cart[0]?.id]);
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/clear  - Xóa toàn bộ giỏ hàng
 */
const clearCart = async (req, res, next) => {
  try {
    const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [req.user.id]);
    if (cart.length) {
      await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
    }
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cart/apply-voucher  - Áp dụng mã voucher
 */
const applyVoucher = async (req, res, next) => {
  try {
    const { code, cart_total } = req.body;

    if (!code || !cart_total) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const [vouchers] = await db.query(
      `SELECT * FROM vouchers
       WHERE code = ? AND is_active = 1
       AND start_date <= NOW() AND expired_at >= NOW()`,
      [code.toUpperCase()]
    );

    if (!vouchers.length) {
      return res.status(400).json({ success: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn' });
    }

    const voucher = vouchers[0];

    if (voucher.used_count >= voucher.max_uses) {
      return res.status(400).json({ success: false, message: 'Mã voucher đã hết lượt sử dụng' });
    }

    if (parseFloat(cart_total) < parseFloat(voucher.min_order_value)) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${Number(voucher.min_order_value).toLocaleString('vi-VN')}đ mới áp dụng được mã này`,
      });
    }

    // Kiểm tra user đã dùng chưa
    const [usages] = await db.query(
      'SELECT COUNT(*) as cnt FROM voucher_usages WHERE voucher_id = ? AND user_id = ?',
      [voucher.id, req.user.id]
    );
    if (usages[0].cnt >= voucher.max_uses_per_user) {
      return res.status(400).json({ success: false, message: 'Bạn đã sử dụng mã này rồi' });
    }

    // Tính giảm giá
    let discount = 0;
    if (voucher.discount_type === 'percent') {
      discount = (parseFloat(cart_total) * parseFloat(voucher.discount_value)) / 100;
      if (voucher.max_discount_amount) {
        discount = Math.min(discount, parseFloat(voucher.max_discount_amount));
      }
    } else {
      discount = parseFloat(voucher.discount_value);
    }

    discount = Math.min(discount, parseFloat(cart_total));
    const final_total = parseFloat(cart_total) - discount;

    res.json({
      success: true,
      message: `Áp dụng mã thành công! Giảm ${discount.toLocaleString('vi-VN')}đ`,
      data: {
        voucher_id:      voucher.id,
        voucher_code:    voucher.code,
        voucher_name:    voucher.name,
        discount_amount: discount,
        final_total,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyVoucher };
