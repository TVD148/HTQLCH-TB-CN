const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// GET /api/vouchers/validate/:code (public)
router.get('/validate/:code', verifyToken, async (req, res, next) => {
  try {
    const { code } = req.params;
    const { cart_total = 0 } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM vouchers WHERE code = ? AND is_active = 1 AND start_date <= NOW() AND expired_at >= NOW()`,
      [code.toUpperCase()]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Mã không hợp lệ hoặc đã hết hạn' });
    }

    const v = rows[0];
    if (v.used_count >= v.max_uses) {
      return res.status(400).json({ success: false, message: 'Mã đã hết lượt sử dụng' });
    }

    if (parseFloat(cart_total) < parseFloat(v.min_order_value)) {
      return res.status(400).json({
        success: false,
        message: `Đơn tối thiểu ${Number(v.min_order_value).toLocaleString('vi-VN')}đ`,
      });
    }

    const [usages] = await db.query(
      'SELECT COUNT(*) as cnt FROM voucher_usages WHERE voucher_id = ? AND user_id = ?',
      [v.id, req.user.id]
    );
    if (usages[0].cnt >= v.max_uses_per_user) {
      return res.status(400).json({ success: false, message: 'Bạn đã sử dụng mã này rồi' });
    }

    let discount = 0;
    if (v.discount_type === 'percent') {
      discount = (parseFloat(cart_total) * v.discount_value) / 100;
      if (v.max_discount_amount) discount = Math.min(discount, v.max_discount_amount);
    } else {
      discount = v.discount_value;
    }

    res.json({
      success: true,
      data: {
        voucher_id: v.id, code: v.code, name: v.name,
        discount_type: v.discount_type, discount_value: v.discount_value,
        discount_amount: discount,
        final_total: parseFloat(cart_total) - discount,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
