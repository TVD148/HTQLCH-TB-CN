const router = require('express').Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(verifyToken);

// POST /api/warranty - Tạo yêu cầu bảo hành
router.post('/', async (req, res, next) => {
  try {
    const { order_item_id, serial_number, issue_description } = req.body;
    if (!order_item_id || !issue_description) {
      return res.status(400).json({ success:false, message: 'Thiếu thông tin' });
    }

    const [items] = await db.query(
      `SELECT oi.*, o.created_at as order_date, o.user_id
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE oi.id = ? AND o.user_id = ? AND o.status = 'delivered'`,
      [order_item_id, req.user.id]
    );

    if (!items.length) {
      return res.status(403).json({ success:false, message: 'Đơn hàng không hợp lệ để bảo hành' });
    }

    const orderDate = new Date(items[0].order_date);
    const monthsDiff = (new Date() - orderDate) / (1000 * 60 * 60 * 24 * 30);
    if (monthsDiff > 12) {
      return res.status(400).json({ success:false, message: 'Sản phẩm đã quá 12 tháng bảo hành' });
    }

    const [result] = await db.query(
      'INSERT INTO warranty_requests (user_id, order_item_id, serial_number, issue_description) VALUES (?, ?, ?, ?)',
      [req.user.id, order_item_id, serial_number || null, issue_description]
    );

    await db.query(
      'INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'Yêu cầu bảo hành đã tiếp nhận',
       `Phiếu bảo hành #${result.insertId} đã được tạo và đang chờ xử lý.`, 'warranty', result.insertId.toString()]
    );

    res.status(201).json({ success:true, message: 'Yêu cầu bảo hành đã gửi thành công!', data: { id: result.insertId } });
  } catch (err) { next(err); }
});

// GET /api/warranty - Lịch sử bảo hành của user
router.get('/', async (req, res, next) => {
  try {
    const [items] = await db.query(
      `SELECT wr.*, oi.product_name, oi.product_thumbnail
       FROM warranty_requests wr
       JOIN order_items oi ON oi.id = wr.order_item_id
       WHERE wr.user_id = ?
       ORDER BY wr.received_at DESC`,
      [req.user.id]
    );
    res.json({ success:true, data: items });
  } catch (err) { next(err); }
});

// Admin routes
router.get('/admin/list', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { status } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND wr.status = ?'; params.push(status); }

    const [items] = await db.query(
      `SELECT wr.*, oi.product_name, u.name as customer_name, u.phone
       FROM warranty_requests wr
       JOIN order_items oi ON oi.id = wr.order_item_id
       JOIN users u ON u.id = wr.user_id
       ${where} ORDER BY wr.received_at DESC`,
      params
    );
    res.json({ success:true, data: items });
  } catch (err) { next(err); }
});

router.patch('/:id/status', authorize('admin','staff'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution_note } = req.body;
    const validStatuses = ['pending','processing','completed','rejected'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success:false, message: 'Trạng thái không hợp lệ' });

    await db.query(
      'UPDATE warranty_requests SET status=?, resolution_note=?, assigned_staff_id=?, completed_at=? WHERE id=?',
      [status, resolution_note || null, req.user.id, status === 'completed' ? new Date() : null, id]
    );

    const [wr] = await db.query('SELECT * FROM warranty_requests WHERE id=?', [id]);
    if (wr.length && ['completed','rejected'].includes(status)) {
      await db.query(
        'INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES (?, ?, ?, ?, ?)',
        [wr[0].user_id, `Bảo hành #${id} đã ${status === 'completed' ? 'hoàn tất' : 'bị từ chối'}`,
         resolution_note || 'Vui lòng liên hệ cửa hàng để biết thêm thông tin.', 'warranty', id.toString()]
      );
    }

    res.json({ success:true, message: 'Cập nhật bảo hành thành công!' });
  } catch (err) { next(err); }
});

module.exports = router;
