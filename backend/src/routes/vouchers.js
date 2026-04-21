const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/vouchers/public ─────────────────────────────
// Lấy các voucher có thể hiện trên trang chủ
router.get('/public', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT
          ma_voucher AS id,
          ma_code AS code,
          ten_voucher AS name,
          loai_giam AS discount_type,
          gia_tri_giam AS discount_value,
          giam_toi_da AS max_discount,
          don_hang_toi_thieu AS min_order,
          ngay_het_han AS expires_at
       FROM ma_giam_gia
       WHERE trang_thai = 1
         AND ngay_bat_dau <= NOW()
         AND ngay_het_han >= NOW()
         AND da_su_dung < so_lan_toi_da
       ORDER BY (loai_giam = 'freeship') DESC, don_hang_toi_thieu ASC
       LIMIT 6`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// ─── GET /api/vouchers/available ─────────────────────────────
// Lay tat ca voucher con hieu luc va phu hop voi don hang hien tai
router.get('/available', verifyToken, async (req, res, next) => {
  try {
    const { cart_total = 0 } = req.query;
    const userId = req.user.id;

    // Query voucher cong khai (khong gioi han nguoi nhan)
    // + voucher duoc cap phat rieng cho user nay
    const [rows] = await db.query(
      `SELECT DISTINCT
          v.ma_voucher       AS id,
          v.ma_code          AS code,
          v.ten_voucher      AS name,
          v.mo_ta            AS description,
          v.loai_giam        AS discount_type,
          v.gia_tri_giam     AS discount_value,
          v.giam_toi_da      AS max_discount,
          v.don_hang_toi_thieu AS min_order,
          v.ngay_het_han     AS expires_at,
          -- kiem tra user da dung chua
          (SELECT COUNT(*) FROM lich_su_voucher lsv
           WHERE lsv.ma_voucher = v.ma_voucher AND lsv.ma_nguoi_dung = ?) AS da_dung,
          v.gioi_han_moi_nguoi,
          v.da_su_dung,
          v.so_lan_toi_da,
          -- co thuoc voucher rieng cho user nay khong
          (SELECT COUNT(*) FROM voucher_nguoi_dung vnd
           WHERE vnd.ma_voucher = v.ma_voucher AND vnd.ma_nguoi_dung = ? AND vnd.da_su_dung = 0) AS la_voucher_rieng
       FROM ma_giam_gia v
       LEFT JOIN voucher_nguoi_dung vnd ON vnd.ma_voucher = v.ma_voucher AND vnd.ma_nguoi_dung = ?
       WHERE v.trang_thai = 1
         AND v.ngay_bat_dau <= NOW()
         AND v.ngay_het_han >= NOW()
         AND (
           -- Voucher cong khai: chua het luot toan cuc
           (v.da_su_dung < v.so_lan_toi_da AND vnd.ma_id IS NULL)
           OR
           -- Voucher rieng cua user: chua dung
           (vnd.ma_id IS NOT NULL AND vnd.da_su_dung = 0)
         )
       ORDER BY v.loai_giam = 'freeship' DESC, v.don_hang_toi_thieu ASC, v.ngay_het_han ASC`,
      [userId, userId, userId]
    );

    const cartNum = parseFloat(cart_total) || 0;

    const vouchers = rows.map(v => {
      const alreadyUsed = v.da_dung >= v.gioi_han_moi_nguoi;
      const eligible = cartNum >= parseFloat(v.min_order || 0);

      let discountAmount = 0;
      if (eligible && !alreadyUsed) {
        if (v.discount_type === 'percent') {
          discountAmount = (cartNum * parseFloat(v.discount_value)) / 100;
          if (v.max_discount) discountAmount = Math.min(discountAmount, parseFloat(v.max_discount));
        } else if (v.discount_type === 'fixed_amount') {
          discountAmount = parseFloat(v.discount_value);
        } else if (v.discount_type === 'freeship') {
          discountAmount = parseFloat(v.discount_value) || 0; // phi ship duoc giam
        }
        discountAmount = Math.min(discountAmount, cartNum);
      }

      return {
        id: v.id,
        code: v.code,
        name: v.name,
        description: v.description,
        discount_type: v.discount_type,
        discount_value: parseFloat(v.discount_value),
        max_discount: v.max_discount ? parseFloat(v.max_discount) : null,
        min_order: parseFloat(v.min_order || 0),
        expires_at: v.expires_at,
        discount_amount: discountAmount,
        eligible,
        already_used: alreadyUsed,
        is_personal: v.la_voucher_rieng > 0,
      };
    });

    res.json({ success: true, data: vouchers });
  } catch (err) { next(err); }
});

// ─── GET /api/vouchers/validate/:code ────────────────────────
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

    // Kiem tra so lan toan bo
    if (v.da_su_dung >= v.so_lan_toi_da) {
      // Xem co phai voucher rieng cua user nay khong
      const [personal] = await db.query(
        'SELECT * FROM voucher_nguoi_dung WHERE ma_voucher = ? AND ma_nguoi_dung = ? AND da_su_dung = 0',
        [v.ma_voucher, req.user.id]
      );
      if (!personal.length) {
        return res.status(400).json({ success: false, message: 'Mã đã hết lượt sử dụng' });
      }
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
    } else if (v.loai_giam === 'fixed_amount') {
      discount = parseFloat(v.gia_tri_giam);
    } else if (v.loai_giam === 'freeship') {
      discount = parseFloat(v.gia_tri_giam) || 0;
    }
    discount = Math.min(discount, parseFloat(cart_total));

    res.json({
      success: true,
      data: {
        voucher_id: v.ma_voucher,
        code: v.ma_code,
        name: v.ten_voucher,
        discount_type: v.loai_giam,
        discount_value: v.gia_tri_giam,
        discount_amount: discount,
        final_total: parseFloat(cart_total) - discount,
      },
    });
  } catch (err) { next(err); }
});

// ─── POST /api/vouchers/send-weekly ──────────────────────────
// Admin/system gui voucher freeship hang tuan cho tat ca user
router.post('/send-weekly', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền' });
    }
    const { voucher_id } = req.body;
    if (!voucher_id) return res.status(400).json({ success: false, message: 'Thiếu voucher_id' });

    // Lay tat ca user active
    const [users] = await db.query(
      "SELECT ma_nguoi_dung AS id, ho_ten AS name FROM nguoi_dung WHERE trang_thai = 1 AND vai_tro = 'user'"
    );
    const [voucherRows] = await db.query(
      'SELECT * FROM ma_giam_gia WHERE ma_voucher = ?', [voucher_id]
    );
    if (!voucherRows.length) return res.status(404).json({ success: false, message: 'Voucher không tồn tại' });

    const v = voucherRows[0];
    let sent = 0;

    for (const user of users) {
      try {
        // Them vao bang voucher_nguoi_dung (bo qua neu da co)
        await db.query(
          'INSERT IGNORE INTO voucher_nguoi_dung (ma_voucher, ma_nguoi_dung) VALUES (?, ?)',
          [voucher_id, user.id]
        );
        // Gui thong bao
        await db.query(
          `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
           VALUES (?, ?, ?, 'khuyen_mai', ?)`,
          [
            user.id,
            `🎁 Voucher ${v.loai_giam === 'freeship' ? 'Miễn phí vận chuyển' : 'Ưu đãi'} tuần này!`,
            `TechStore gửi tặng bạn mã "${v.ma_code}" – ${v.ten_voucher}. ${
              v.don_hang_toi_thieu > 0
                ? `Áp dụng cho đơn từ ${Number(v.don_hang_toi_thieu).toLocaleString('vi-VN')}đ.`
                : 'Không yêu cầu giá trị đơn hàng tối thiểu.'
            } HSD: ${new Date(v.ngay_het_han).toLocaleDateString('vi-VN')}`,
            v.ma_code,
          ]
        );
        sent++;
      } catch (_) { /* Skip if unique constraint */ }
    }

    res.json({ success: true, message: `Đã gửi voucher cho ${sent}/${users.length} người dùng` });
  } catch (err) { next(err); }
});

module.exports = router;
