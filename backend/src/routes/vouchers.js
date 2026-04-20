const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// GET /api/vouchers/validate/:code
router.get('/validate/:code', verifyToken, async (req, res, next) => {
  try {
    const { code } = req.params;
    const { cart_total = 0 } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM ma_giam_gia
       WHERE ma_code = ? AND trang_thai = 1
       AND ngay_bat_dau <= NOW() AND ngay_het_han >= NOW()`,
      [code.toUpperCase()]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Mã không hợp lệ hoặc đã hết hạn' });
    }

    const v = rows[0];
    if (v.da_su_dung >= v.so_lan_toi_da) {
      return res.status(400).json({ success: false, message: 'Mã đã hết lượt sử dụng' });
    }

    if (parseFloat(cart_total) < parseFloat(v.don_hang_toi_thieu)) {
      return res.status(400).json({
        success: false,
        message: `Đơn tối thiểu ${Number(v.don_hang_toi_thieu).toLocaleString('vi-VN')}đ`,
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
      discount = (parseFloat(cart_total) * v.gia_tri_giam) / 100;
      if (v.giam_toi_da) discount = Math.min(discount, v.giam_toi_da);
    } else {
      discount = v.gia_tri_giam;
    }
    discount = Math.min(discount, parseFloat(cart_total));

    res.json({
      success: true,
      data: {
        voucher_id:    v.ma_voucher,
        code:          v.ma_code,
        name:          v.ten_voucher,
        discount_type:  v.loai_giam,
        discount_value: v.gia_tri_giam,
        discount_amount: discount,
        final_total:    parseFloat(cart_total) - discount,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
