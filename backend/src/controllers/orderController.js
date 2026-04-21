const db = require('../config/database');

const generateOrderCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `DH-${date}-${rand}`;
};

/** POST /api/orders */
const createOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      receiver_name, receiver_phone, shipping_address,
      payment_method = 'tien_mat', note = '',
      voucher_id = null, loyalty_points_used = 0,
    } = req.body;

    if (!receiver_name || !receiver_phone || !shipping_address) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Thiếu thông tin giao hàng' });
    }

    // Lấy giỏ hàng
    const [cartRows] = await conn.query(
      'SELECT ma_gio_hang FROM gio_hang WHERE ma_nguoi_dung = ?', [req.user.id]
    );
    if (!cartRows.length) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const [items] = await conn.query(
      `SELECT ctgh.ma_chi_tiet AS id, ctgh.ma_san_pham AS product_id,
              ctgh.so_luong AS quantity, ctgh.don_gia AS unit_price,
              sp.ten_san_pham AS name, sp.anh_dai_dien AS thumbnail, sp.so_luong_ton AS stock_quantity
       FROM chi_tiet_gio_hang ctgh
       JOIN san_pham sp ON sp.ma_san_pham = ctgh.ma_san_pham
       WHERE ctgh.ma_gio_hang = ?`,
      [cartRows[0].ma_gio_hang]
    );

    if (!items.length) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    for (const item of items) {
      if (item.quantity > item.stock_quantity) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${item.name}" chỉ còn ${item.stock_quantity} trong kho`,
        });
      }
    }

    const subtotal = items.reduce((s, i) => s + parseFloat(i.unit_price) * i.quantity, 0);
    let discountAmount = 0;
    let shippingDiscount = 0; // Rieng freeship

    // ─── Voucher ────────────────────────────────────────────
    if (voucher_id) {
      const [vouchers] = await conn.query(
        'SELECT * FROM ma_giam_gia WHERE ma_voucher = ? AND trang_thai = 1 AND ngay_het_han >= NOW()',
        [voucher_id]
      );
      if (vouchers.length) {
        const v = vouchers[0];

        // Kiem tra dieu kien don toi thieu
        if (subtotal >= parseFloat(v.don_hang_toi_thieu || 0)) {
          if (v.loai_giam === 'percent') {
            discountAmount = (subtotal * parseFloat(v.gia_tri_giam)) / 100;
            if (v.giam_toi_da) discountAmount = Math.min(discountAmount, parseFloat(v.giam_toi_da));
            discountAmount = Math.min(discountAmount, subtotal);
          } else if (v.loai_giam === 'fixed_amount') {
            discountAmount = Math.min(parseFloat(v.gia_tri_giam), subtotal);
          } else if (v.loai_giam === 'freeship') {
            // Freeship: ghi nhan phi ship duoc mien (hien tai phi ship = 0, dat cho tuong lai)
            shippingDiscount = parseFloat(v.gia_tri_giam) || 0;
          }
        }

        await conn.query(
          'UPDATE ma_giam_gia SET da_su_dung = da_su_dung + 1 WHERE ma_voucher = ?',
          [voucher_id]
        );

        // Danh dau voucher_nguoi_dung da su dung (neu la voucher rieng)
        await conn.query(
          `UPDATE voucher_nguoi_dung SET da_su_dung = 1, ngay_su_dung = NOW()
           WHERE ma_voucher = ? AND ma_nguoi_dung = ? AND da_su_dung = 0`,
          [voucher_id, req.user.id]
        );
      }
    }

    // ─── Diem tich luy: 100K = 1 diem, 1 diem = 1K ─────────
    let pointsDeduction = 0;
    if (loyalty_points_used > 0) {
      const [userRow] = await conn.query(
        'SELECT diem_tich_luy FROM nguoi_dung WHERE ma_nguoi_dung = ?', [req.user.id]
      );
      const pointsToUse = Math.min(loyalty_points_used, userRow[0].diem_tich_luy);
      pointsDeduction = pointsToUse * 1000; // 1 diem = 1000 VND
      pointsDeduction = Math.min(pointsDeduction, subtotal - discountAmount);
      await conn.query(
        'UPDATE nguoi_dung SET diem_tich_luy = diem_tich_luy - ? WHERE ma_nguoi_dung = ?',
        [pointsToUse, req.user.id]
      );
    }

    const phi_van_chuyen = Math.max(0, 0 - shippingDiscount); // Phi ship = 0, freeship giu de mo rong
    const tong_tien = subtotal - discountAmount - pointsDeduction + phi_van_chuyen;
    const pointsEarned = Math.floor(tong_tien / 100000); // 100K = 1 diem
    const ma_code = generateOrderCode();


    const [orderResult] = await conn.query(
      `INSERT INTO don_hang
         (ma_nguoi_dung, ma_code, tam_tinh, so_tien_giam, phi_van_chuyen, tong_tien,
          ma_voucher, diem_su_dung, diem_tich_duoc, trang_thai, phuong_thuc_tt,
          ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi_giao_hang, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'cho_xac_nhan', ?, ?, ?, ?, ?)`,
      [req.user.id, ma_code, subtotal, discountAmount, phi_van_chuyen, tong_tien,
       voucher_id || null, loyalty_points_used, pointsEarned, payment_method,
       receiver_name, receiver_phone, shipping_address, note]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO chi_tiet_don_hang
           (ma_don_hang, ma_san_pham, ten_san_pham, anh_san_pham, don_gia, so_luong, thanh_tien)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.thumbnail,
         item.unit_price, item.quantity, parseFloat(item.unit_price) * item.quantity]
      );

      const stockBefore = item.stock_quantity;
      const stockAfter = stockBefore - item.quantity;
      await conn.query(
        'UPDATE san_pham SET so_luong_ton = ? WHERE ma_san_pham = ?', [stockAfter, item.product_id]
      );
      await conn.query(
        `INSERT INTO lich_su_kho
           (ma_san_pham, ma_nguoi_dung, so_luong_bien_dong, ton_kho_truoc, ton_kho_sau, loai_giao_dich, ghi_chu, ma_tham_chieu)
         VALUES (?, ?, ?, ?, ?, 'xuat', ?, ?)`,
        [item.product_id, req.user.id, -item.quantity, stockBefore, stockAfter,
         `Xuất theo đơn hàng ${ma_code}`, ma_code]
      );
    }

    if (voucher_id && discountAmount > 0) {
      await conn.query(
        'INSERT INTO lich_su_voucher (ma_voucher, ma_nguoi_dung, ma_don_hang, so_tien_giam) VALUES (?, ?, ?, ?)',
        [voucher_id, req.user.id, orderId, discountAmount]
      );
    }

    if (pointsEarned > 0) {
      await conn.query(
        'UPDATE nguoi_dung SET diem_tich_luy = diem_tich_luy + ? WHERE ma_nguoi_dung = ?',
        [pointsEarned, req.user.id]
      );
    }

    await conn.query('DELETE FROM chi_tiet_gio_hang WHERE ma_gio_hang = ?', [cartRows[0].ma_gio_hang]);

    await conn.query(
      `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, 'Đặt hàng thành công! 🎉',
       `Đơn hàng #${ma_code} đã được tạo. Tổng tiền: ${tong_tien.toLocaleString('vi-VN')}đ`,
       'don_hang', ma_code]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: {
        order_id: orderId,
        order_code: ma_code,
        total_amount: tong_tien,
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

/** GET /api/orders */
const getUserOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE dh.ma_nguoi_dung = ?';
    const params = [req.user.id];
    if (status) { where += ' AND dh.trang_thai = ?'; params.push(status); }

    const [orders] = await db.query(
      `SELECT dh.ma_don_hang AS id, dh.ma_code AS order_code, dh.tong_tien AS total_amount,
              dh.so_tien_giam AS discount_amount, dh.trang_thai AS status,
              dh.phuong_thuc_tt AS payment_method, dh.trang_thai_tt AS payment_status,
              dh.ngay_tao AS created_at, COUNT(ctdh.ma_chi_tiet) AS item_count
       FROM don_hang dh
       LEFT JOIN chi_tiet_don_hang ctdh ON ctdh.ma_don_hang = dh.ma_don_hang
       ${where}
       GROUP BY dh.ma_don_hang
       ORDER BY dh.ngay_tao DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

/** GET /api/orders/:id */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [orders] = await db.query(
      `SELECT dh.*,
              dh.ma_don_hang AS id, dh.ma_code AS order_code,
              dh.tong_tien AS total_amount, dh.so_tien_giam AS discount_amount,
              dh.tam_tinh AS subtotal, dh.phi_van_chuyen AS shipping_fee,
              dh.trang_thai AS status, dh.phuong_thuc_tt AS payment_method,
              dh.trang_thai_tt AS payment_status,
              dh.ten_nguoi_nhan AS receiver_name, dh.sdt_nguoi_nhan AS receiver_phone,
              dh.dia_chi_giao_hang AS shipping_address, dh.ghi_chu AS note,
              dh.diem_su_dung AS loyalty_points_used, dh.diem_tich_duoc AS loyalty_points_earned,
              dh.ngay_tao AS created_at,
              mgg.ma_code AS voucher_code
       FROM don_hang dh
       LEFT JOIN ma_giam_gia mgg ON mgg.ma_voucher = dh.ma_voucher
       WHERE dh.ma_don_hang = ? AND dh.ma_nguoi_dung = ?`,
      [id, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    const [items] = await db.query(
      `SELECT ma_chi_tiet AS id, ma_san_pham AS product_id, ten_san_pham AS product_name,
              anh_san_pham AS product_thumbnail, don_gia AS unit_price, so_luong AS quantity, thanh_tien AS subtotal
       FROM chi_tiet_don_hang WHERE ma_don_hang = ?`, [id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) { next(err); }
};

/** PUT /api/orders/:id/cancel */
const cancelOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;

    const [orders] = await conn.query(
      'SELECT * FROM don_hang WHERE ma_don_hang = ? AND ma_nguoi_dung = ?', [id, req.user.id]
    );
    if (!orders.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    const order = orders[0];
    if (!['cho_xac_nhan', 'da_xac_nhan'].includes(order.trang_thai)) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Không thể hủy đơn hàng ở trạng thái này' });
    }

    const [items] = await conn.query(
      'SELECT * FROM chi_tiet_don_hang WHERE ma_don_hang = ?', [id]
    );
    for (const item of items) {
      const [p] = await conn.query(
        'SELECT so_luong_ton FROM san_pham WHERE ma_san_pham = ?', [item.ma_san_pham]
      );
      const stockBefore = p[0].so_luong_ton;
      const stockAfter = stockBefore + item.so_luong;
      await conn.query('UPDATE san_pham SET so_luong_ton = ? WHERE ma_san_pham = ?', [stockAfter, item.ma_san_pham]);
      await conn.query(
        `INSERT INTO lich_su_kho (ma_san_pham, ma_nguoi_dung, so_luong_bien_dong, ton_kho_truoc, ton_kho_sau, loai_giao_dich, ghi_chu, ma_tham_chieu)
         VALUES (?, ?, ?, ?, ?, 'hoan_tra', 'Hoàn kho do hủy đơn', ?)`,
        [item.ma_san_pham, req.user.id, item.so_luong, stockBefore, stockAfter, order.ma_code]
      );
    }

    if (order.diem_su_dung > 0) {
      await conn.query(
        'UPDATE nguoi_dung SET diem_tich_luy = diem_tich_luy + ? WHERE ma_nguoi_dung = ?',
        [order.diem_su_dung, req.user.id]
      );
    }

    await conn.query("UPDATE don_hang SET trang_thai = 'da_huy' WHERE ma_don_hang = ?", [id]);
    await conn.query(
      `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, 'Đơn hàng đã hủy',
       `Đơn hàng #${order.ma_code} đã được hủy thành công.`, 'don_hang', order.ma_code]
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
