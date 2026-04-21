const router = require('express').Router();
const db = require('../config/database');
const { verifyToken, requireStaff } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/warranty/eligible-products — Lấy sản phẩm đã mua còn bảo hành
router.get('/eligible-products', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT ctdh.ma_chi_tiet AS order_item_id,
              ctdh.ten_san_pham AS product_name,
              ctdh.anh_san_pham AS thumbnail,
              ctdh.don_gia AS price,
              dh.ma_don_hang AS order_id,
              dh.ma_don_hang AS order_code,
              dh.ngay_tao AS order_date,
              sp.thoi_gian_bao_hanh AS warranty_months,
              TIMESTAMPDIFF(MONTH, dh.ngay_tao, NOW()) AS months_used
       FROM chi_tiet_don_hang ctdh
       JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
       LEFT JOIN san_pham sp ON sp.ma_san_pham = ctdh.ma_san_pham
       WHERE dh.ma_nguoi_dung = ?
         AND dh.trang_thai = 'da_giao'
         AND TIMESTAMPDIFF(MONTH, dh.ngay_tao, NOW()) < COALESCE(sp.thoi_gian_bao_hanh, 12)
       ORDER BY dh.ngay_tao DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// POST /api/warranty — Tạo yêu cầu bảo hành
router.post('/', async (req, res, next) => {
  try {
    const { order_item_id, serial_number, issue_description, hinh_thuc, so_dien_thoai, lich_hen } = req.body;
    if (!order_item_id || !issue_description || !hinh_thuc) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }
    if (!['buu_dien', 'ship_ve', 'den_cua_hang'].includes(hinh_thuc)) {
      return res.status(400).json({ success: false, message: 'Hình thức không hợp lệ' });
    }
    if (hinh_thuc === 'den_cua_hang' && !lich_hen) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn thời gian hẹn đến cửa hàng' });
    }

    // Kiểm tra order_item thuộc user và còn bảo hành
    const [items] = await db.query(
      `SELECT ctdh.*, dh.ngay_tao AS order_date, dh.ma_nguoi_dung,
              sp.thoi_gian_bao_hanh AS warranty_months
       FROM chi_tiet_don_hang ctdh
       JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
       LEFT JOIN san_pham sp ON sp.ma_san_pham = ctdh.ma_san_pham
       WHERE ctdh.ma_chi_tiet = ? AND dh.ma_nguoi_dung = ? AND dh.trang_thai = 'da_giao'`,
      [order_item_id, req.user.id]
    );

    if (!items.length) {
      return res.status(403).json({ success: false, message: 'Đơn hàng không hợp lệ để bảo hành' });
    }

    const warrantyMonths = items[0].warranty_months || 12;
    const monthsUsed = (new Date() - new Date(items[0].order_date)) / (1000 * 60 * 60 * 24 * 30);
    if (monthsUsed > warrantyMonths) {
      return res.status(400).json({ success: false, message: `Sản phẩm đã quá ${warrantyMonths} tháng bảo hành` });
    }

    // Kiểm tra chưa có yêu cầu active cho sản phẩm này
    const [existing] = await db.query(
      `SELECT ma_bao_hanh FROM yeu_cau_bao_hanh
       WHERE ma_chi_tiet_dh = ? AND trang_thai IN ('cho_xu_ly', 'dang_xu_ly')`,
      [order_item_id]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Sản phẩm này đang có yêu cầu bảo hành chờ xử lý' });
    }

    const [result] = await db.query(
      `INSERT INTO yeu_cau_bao_hanh
         (ma_nguoi_dung, ma_chi_tiet_dh, so_serial, mo_ta_su_co, hinh_thuc, so_dien_thoai, lich_hen)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, order_item_id, serial_number || null, issue_description,
       hinh_thuc, so_dien_thoai || null, lich_hen || null]
    );

    const hinhThucLabel = hinh_thuc === 'buu_dien' ? 'gửi bưu điện'
      : hinh_thuc === 'ship_ve' ? 'ship về cửa hàng'
      : `hẹn đến cửa hàng lúc ${new Date(lich_hen).toLocaleString('vi-VN')}`;
    await db.query(
      `INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, 'Yêu cầu bảo hành đã tiếp nhận',
       `Phiếu BH #${result.insertId} — ${items[0].ten_san_pham} — Hình thức: ${hinhThucLabel}. Chờ nhân viên liên hệ.`,
       'bao_hanh', result.insertId.toString()]
    );

    res.status(201).json({ success: true, message: 'Yêu cầu bảo hành đã gửi thành công!', data: { id: result.insertId } });
  } catch (err) { next(err); }
});

// GET /api/warranty — Lịch sử bảo hành của user
router.get('/', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT ycbh.ma_bao_hanh AS id, ycbh.mo_ta_su_co AS issue_description,
              ycbh.hinh_thuc, ycbh.so_dien_thoai, ycbh.lich_hen,
              ycbh.trang_thai AS status, ycbh.ghi_chu_xu_ly AS admin_note,
              ycbh.ngay_tiep_nhan AS created_at, ycbh.ngay_hoan_thanh AS completed_at,
              ctdh.ten_san_pham AS product_name, ctdh.anh_san_pham AS product_thumbnail,
              dh.ma_don_hang AS order_code
       FROM yeu_cau_bao_hanh ycbh
       JOIN chi_tiet_don_hang ctdh ON ctdh.ma_chi_tiet = ycbh.ma_chi_tiet_dh
       JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang
       WHERE ycbh.ma_nguoi_dung = ?
       ORDER BY ycbh.ngay_tiep_nhan DESC`,
      [req.user.id]
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

// GET /api/warranty/admin/list
router.get('/admin/list', requireStaff, async (req, res, next) => {
  try {
    const { status } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND ycbh.trang_thai = ?'; params.push(status); }

    const [items] = await db.query(
      `SELECT ycbh.ma_bao_hanh AS id, ycbh.so_serial, ycbh.mo_ta_su_co AS issue_description,
              ycbh.hinh_thuc, ycbh.lich_hen, ycbh.so_dien_thoai,
              ycbh.trang_thai AS status, ycbh.ghi_chu_xu_ly AS resolution_note,
              ycbh.ngay_tiep_nhan AS received_at, ycbh.ngay_hoan_thanh AS completed_at,
              ctdh.ten_san_pham AS product_name,
              nd.ho_ten AS customer_name, nd.so_dien_thoai AS customer_phone
       FROM yeu_cau_bao_hanh ycbh
       JOIN chi_tiet_don_hang ctdh ON ctdh.ma_chi_tiet = ycbh.ma_chi_tiet_dh
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = ycbh.ma_nguoi_dung
       ${where} ORDER BY ycbh.ngay_tiep_nhan DESC`,
      params
    );
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

module.exports = router;
