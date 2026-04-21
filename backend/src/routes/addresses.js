const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/addresses ───────────────────────────────────────
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT ma_dia_chi AS id, ten_nhan AS label, dia_chi_day_du AS address,
              tinh_thanh AS city, quan_huyen AS district, lat, lng, la_mac_dinh AS is_default
       FROM dia_chi_nguoi_dung
       WHERE ma_nguoi_dung = ?
       ORDER BY la_mac_dinh DESC, ngay_tao DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// ─── POST /api/addresses ──────────────────────────────────────
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { label = 'Nhà', address, city, district, lat, lng, is_default = false } = req.body;
    if (!address) return res.status(400).json({ success: false, message: 'Địa chỉ không được trống' });
    const userId = req.user.id;

    // Nếu đặt mặc định → bỏ mặc định của những địa chỉ cũ
    if (is_default) {
      await db.query('UPDATE dia_chi_nguoi_dung SET la_mac_dinh = 0 WHERE ma_nguoi_dung = ?', [userId]);
    }
    const [result] = await db.query(
      `INSERT INTO dia_chi_nguoi_dung (ma_nguoi_dung, ten_nhan, dia_chi_day_du, tinh_thanh, quan_huyen, lat, lng, la_mac_dinh)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, label, address, city || null, district || null, lat || null, lng || null, is_default ? 1 : 0]
    );
    res.json({ success: true, data: { id: result.insertId }, message: 'Đã thêm địa chỉ!' });
  } catch (err) { next(err); }
});

// ─── PUT /api/addresses/:id ───────────────────────────────────
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, address, city, district, lat, lng, is_default } = req.body;
    const userId = req.user.id;

    const [owns] = await db.query(
      'SELECT ma_dia_chi FROM dia_chi_nguoi_dung WHERE ma_dia_chi = ? AND ma_nguoi_dung = ?',
      [id, userId]
    );
    if (!owns.length) return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });

    if (is_default) {
      await db.query('UPDATE dia_chi_nguoi_dung SET la_mac_dinh = 0 WHERE ma_nguoi_dung = ?', [userId]);
    }
    await db.query(
      `UPDATE dia_chi_nguoi_dung SET ten_nhan=?, dia_chi_day_du=?, tinh_thanh=?, quan_huyen=?, lat=?, lng=?, la_mac_dinh=?
       WHERE ma_dia_chi = ?`,
      [label, address, city || null, district || null, lat || null, lng || null, is_default ? 1 : 0, id]
    );
    res.json({ success: true, message: 'Đã cập nhật địa chỉ!' });
  } catch (err) { next(err); }
});

// ─── PATCH /api/addresses/:id/default ────────────────────────
router.patch('/:id/default', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await db.query('UPDATE dia_chi_nguoi_dung SET la_mac_dinh = 0 WHERE ma_nguoi_dung = ?', [userId]);
    await db.query(
      'UPDATE dia_chi_nguoi_dung SET la_mac_dinh = 1 WHERE ma_dia_chi = ? AND ma_nguoi_dung = ?',
      [id, userId]
    );
    res.json({ success: true, message: 'Đã đặt địa chỉ mặc định!' });
  } catch (err) { next(err); }
});

// ─── DELETE /api/addresses/:id ────────────────────────────────
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await db.query(
      'DELETE FROM dia_chi_nguoi_dung WHERE ma_dia_chi = ? AND ma_nguoi_dung = ?',
      [id, userId]
    );
    res.json({ success: true, message: 'Đã xóa địa chỉ!' });
  } catch (err) { next(err); }
});

module.exports = router;
