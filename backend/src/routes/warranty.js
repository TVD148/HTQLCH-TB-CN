const router = require('express').Router();
const db = require('../config/database');
const { verifyToken, requireStaff } = require('../middleware/auth');

router.use(verifyToken);

// POST /api/warranty — Tạo yêu cầu bảo hành
router.post('/', async (req, res, next) => {
  try {
    const { order_item_id, serial_number, issue_description } = req.body;
    if (!order_item_id || !issue_description) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const [items] = await db.query(
      `SELECT ctdh.*, dh.ngay_tao AS order_date, dh.ma_nguoi_dung
       FROM chi_tiet_don_hang ctdh
       JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
       WHERE ctdh.ma_chi_tiet = ? AND dh.ma_nguoi_dung = ? AND dh.trang_thai = 'da_giao'`,
      [order_item_id, req.user.id]
    );

    if (!items.length) {
      return res.status(403).json({ success: false, message: 'Đơn hàng không hợp lệ để bảo hành' });
    }

    const monthsDiff = (new Date() - new Date(items[0].order_date)) / (1000 * 60 * 60 * 24 * 30);
    if (monthsDiff > 12) {
      return res.status(400).json({ success: false, message: 'Sản phẩm đã quá 12 tháng bảo hành' });
    }

    const [result] = await db.query(
      `INSERT INTO yeu_cau_bao_hanh (ma_nguoi_dung, ma_chi_tiet_dh, so_serial, mo_ta_su_co)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, order_item_id, serial_number || null, issue_description]
    );

    await db.query(
      `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, 'Yêu cầu bảo hành đã tiếp nhận',
       `Phiếu bảo hành #${result.insertId} đang chờ xử lý.`, 'bao_hanh', result.insertId.toString()]
    );

    res.status(201).json({ success: true, message: 'Yêu cầu bảo hành đã gửi thành công!', data: { id: result.insertId } });
  } catch (err) { next(err); }
});

// GET /api/warranty — Lịch sử bảo hành của user
router.get('/', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT ycbh.*,
              ycbh.ma_bao_hanh AS id, ycbh.mo_ta_su_co AS issue_description,
              ycbh.trang_thai AS status, ycbh.ghi_chu_xu_ly AS resolution_note,
              ycbh.ngay_tiep_nhan AS received_at, ycbh.ngay_hoan_thanh AS completed_at,
              ctdh.ten_san_pham AS product_name, ctdh.anh_san_pham AS product_thumbnail
       FROM yeu_cau_bao_hanh ycbh
       JOIN chi_tiet_don_hang ctdh ON ctdh.ma_chi_tiet = ycbh.ma_chi_tiet_dh
       WHERE ycbh.ma_nguoi_dung = ?
       ORDER BY ycbh.ngay_tiep_nhan DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// GET /api/warranty/admin/list — Admin: danh sách bảo hành
router.get('/admin/list', requireStaff, async (req, res, next) => {
  try {
    const { status } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND ycbh.trang_thai = ?'; params.push(status); }

    const [items] = await db.query(
      `SELECT ycbh.ma_bao_hanh AS id, ycbh.so_serial, ycbh.mo_ta_su_co AS issue_description,
              ycbh.trang_thai AS status, ycbh.ghi_chu_xu_ly AS resolution_note,
              ycbh.ngay_tiep_nhan AS received_at, ycbh.ngay_hoan_thanh AS completed_at,
              ctdh.ten_san_pham AS product_name,
              nd.ho_ten AS customer_name, nd.so_dien_thoai AS phone
       FROM yeu_cau_bao_hanh ycbh
       JOIN chi_tiet_don_hang ctdh ON ctdh.ma_chi_tiet = ycbh.ma_chi_tiet_dh
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = ycbh.ma_nguoi_dung
       ${where} ORDER BY ycbh.ngay_tiep_nhan DESC`,
      params
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// PATCH /api/warranty/:id/status — Admin: cập nhật trạng thái
router.patch('/:id/status', requireStaff, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution_note } = req.body;
    const validStatuses = ['cho_xu_ly', 'dang_xu_ly', 'hoan_thanh', 'tu_choi'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    await db.query(
      `UPDATE yeu_cau_bao_hanh SET
         trang_thai=?, ghi_chu_xu_ly=?, ma_nhan_vien_xu_ly=?,
         ngay_hoan_thanh=?
       WHERE ma_bao_hanh=?`,
      [status, resolution_note || null, req.user.id,
       status === 'hoan_thanh' ? new Date() : null, id]
    );

    const [ycbh] = await db.query('SELECT * FROM yeu_cau_bao_hanh WHERE ma_bao_hanh=?', [id]);
    if (ycbh.length && ['hoan_thanh', 'tu_choi'].includes(status)) {
      await db.query(
        `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
         VALUES (?, ?, ?, ?, ?)`,
        [ycbh[0].ma_nguoi_dung,
         `Bảo hành #${id} đã ${status === 'hoan_thanh' ? 'hoàn tất' : 'bị từ chối'}`,
         resolution_note || 'Vui lòng liên hệ cửa hàng để biết thêm thông tin.', 'bao_hanh', id.toString()]
      );
    }

    res.json({ success: true, message: 'Cập nhật bảo hành thành công!' });
  } catch (err) { next(err); }
});

module.exports = router;
