const db = require('../config/database');

/** GET /api/cart */
const getCart = async (req, res, next) => {
  try {
    const [cart] = await db.query(
      'SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]
    );
    if (!cart.length) {
      return res.json({ success: true, data: { items: [], subtotal: 0, item_count: 0 } });
    }

    const [items] = await db.query(
      `SELECT ctgh.ma_chi_tiet AS id, ctgh.so_luong AS quantity, ctgh.don_gia AS unit_price,
              sp.ma_san_pham AS product_id, sp.ten_san_pham AS name, sp.duong_dan AS slug,
              sp.anh_dai_dien AS thumbnail,
              sp.gia_goc AS current_price, sp.gia_khuyen_mai AS sale_price,
              sp.so_luong_ton AS stock_quantity,
              (ctgh.so_luong * ctgh.don_gia) AS subtotal
       FROM chi_tiet_gio_hang ctgh
       JOIN san_pham sp ON sp.ma_san_pham = ctgh.ma_san_pham
       WHERE ctgh.ma_gio_hang = ? AND sp.trang_thai = 1`,
      [cart[0].ma_gio_hang]
    );

    const subtotal   = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
    const item_count = items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({ success: true, data: { items, subtotal, item_count } });
  } catch (err) { next(err); }
};

/** POST /api/cart/add */
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const [products] = await db.query(
      `SELECT ma_san_pham, gia_goc AS price, gia_khuyen_mai AS sale_price, so_luong_ton AS stock_quantity
       FROM san_pham WHERE ma_san_pham = ? AND trang_thai = 1`,
      [product_id]
    );
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    const product = products[0];
    const unitPrice = product.sale_price || product.price;

    // Lấy hoặc tạo giỏ hàng
    const [cartRows] = await db.query('SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]);
    let cartId;
    if (!cartRows.length) {
      const [r] = await db.query('INSERT INTO gio_hang (ma_nguoi_dung) VALUES (?)', [req.user.id]);
      cartId = r.insertId;
    } else {
      cartId = cartRows[0].ma_gio_hang;
    }

    const [existing] = await db.query(
      'SELECT ma_chi_tiet, so_luong FROM chi_tiet_gio_hang WHERE ma_gio_hang = ? AND ma_san_pham = ?',
      [cartId, product_id]
    );

    const newQty = existing.length ? existing[0].so_luong + quantity : quantity;

    if (newQty > product.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho`,
      });
    }

    if (existing.length) {
      await db.query(
        'UPDATE chi_tiet_gio_hang SET so_luong = ?, don_gia = ? WHERE ma_chi_tiet = ?',
        [newQty, unitPrice, existing[0].ma_chi_tiet]
      );
    } else {
      await db.query(
        'INSERT INTO chi_tiet_gio_hang (ma_gio_hang, ma_san_pham, so_luong, don_gia) VALUES (?, ?, ?, ?)',
        [cartId, product_id, quantity, unitPrice]
      );
    }

    const [countResult] = await db.query(
      'SELECT SUM(so_luong) AS item_count FROM chi_tiet_gio_hang WHERE ma_gio_hang = ?', [cartId]
    );

    res.json({ success: true, message: 'Đã thêm vào giỏ hàng!', data: { item_count: countResult[0].item_count || 0 } });
  } catch (err) { next(err); }
};

/** PUT /api/cart/items/:id */
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ' });
    }

    const [cart] = await db.query('SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]);
    const [item] = await db.query(
      `SELECT ctgh.*, sp.so_luong_ton AS stock_quantity
       FROM chi_tiet_gio_hang ctgh
       JOIN san_pham sp ON sp.ma_san_pham = ctgh.ma_san_pham
       WHERE ctgh.ma_chi_tiet = ? AND ctgh.ma_gio_hang = ?`,
      [id, cart[0]?.ma_gio_hang]
    );

    if (!item.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ' });
    }
    if (quantity > item[0].stock_quantity) {
      return res.status(400).json({ success: false, message: `Chỉ còn ${item[0].stock_quantity} sản phẩm` });
    }

    await db.query('UPDATE chi_tiet_gio_hang SET so_luong = ? WHERE ma_chi_tiet = ?', [quantity, id]);
    res.json({ success: true, message: 'Đã cập nhật số lượng' });
  } catch (err) { next(err); }
};

/** DELETE /api/cart/items/:id */
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [cart] = await db.query('SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]);
    await db.query('DELETE FROM chi_tiet_gio_hang WHERE ma_chi_tiet = ? AND ma_gio_hang = ?', [id, cart[0]?.ma_gio_hang]);
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ' });
  } catch (err) { next(err); }
};

/** DELETE /api/cart/clear */
const clearCart = async (req, res, next) => {
  try {
    const [cart] = await db.query('SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]);
    if (cart.length) {
      await db.query('DELETE FROM chi_tiet_gio_hang WHERE ma_gio_hang = ?', [cart[0].ma_gio_hang]);
    }
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) { next(err); }
};

/** POST /api/cart/apply-voucher */
const applyVoucher = async (req, res, next) => {
  try {
    const { code, cart_total } = req.body;

    if (!code || !cart_total) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const [vouchers] = await db.query(
      `SELECT * FROM ma_giam_gia
       WHERE ma_code = ? AND trang_thai = 1
       AND ngay_bat_dau <= NOW() AND ngay_het_han >= NOW()`,
      [code.toUpperCase()]
    );

    if (!vouchers.length) {
      return res.status(400).json({ success: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn' });
    }

    const v = vouchers[0];

    if (v.da_su_dung >= v.so_lan_toi_da) {
      return res.status(400).json({ success: false, message: 'Mã voucher đã hết lượt sử dụng' });
    }

    if (parseFloat(cart_total) < parseFloat(v.don_hang_toi_thieu)) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${Number(v.don_hang_toi_thieu).toLocaleString('vi-VN')}đ mới áp dụng được mã này`,
      });
    }

    const [usages] = await db.query(
      'SELECT COUNT(*) AS cnt FROM lich_su_voucher WHERE ma_voucher = ? AND ma_nguoi_dung = ?',
      [v.ma_voucher, req.user.id]
    );
    if (usages[0].cnt >= v.gioi_han_moi_nguoi) {
      return res.status(400).json({ success: false, message: 'Bạn đã sử dụng mã này rồi' });
    }

    let discount = 0;
    if (v.loai_giam === 'percent') {
      discount = (parseFloat(cart_total) * parseFloat(v.gia_tri_giam)) / 100;
      if (v.giam_toi_da) discount = Math.min(discount, parseFloat(v.giam_toi_da));
    } else {
      discount = parseFloat(v.gia_tri_giam);
    }

    discount = Math.min(discount, parseFloat(cart_total));
    const final_total = parseFloat(cart_total) - discount;

    res.json({
      success: true,
      message: `Áp dụng mã thành công! Giảm ${discount.toLocaleString('vi-VN')}đ`,
      data: {
        voucher_id:      v.ma_voucher,
        voucher_code:    v.ma_code,
        voucher_name:    v.ten_voucher,
        discount_amount: discount,
        final_total,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyVoucher };
