import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const STATUS_LABELS = {
  cho_xac_nhan: 'Chờ xác nhận',
  da_xac_nhan:  'Đã xác nhận',
  dang_giao:    'Đang giao',
  da_giao:      'Đã giao',
  da_huy:       'Đã hủy',
  hoan_tien:    'Hoàn tiền',
};

const STATUS_COLORS = {
  cho_xac_nhan: { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  da_xac_nhan:  { bg: 'rgba(59,130,246,0.15)',   color: '#3b82f6' },
  dang_giao:    { bg: 'rgba(139,92,246,0.15)',    color: '#8b5cf6' },
  da_giao:      { bg: 'rgba(34,197,94,0.15)',     color: '#22c55e' },
  da_huy:       { bg: 'rgba(239,68,68,0.15)',     color: '#ef4444' },
  hoan_tien:    { bg: 'rgba(156,163,175,0.15)',   color: '#9ca3af' },
};

// Map trạng thái thanh toán → hiển thị
const PAYMENT_DISPLAY = {
  da_tt:        { label: '\u2705 Đã TT',     color: 'var(--emerald)' },
  da_hoan_tien: { label: '\u21a9\ufe0f Hoàn tiền', color: '#a78bfa' },
  chua_tt:      { label: '\u23f3 Chưa TT',   color: 'var(--amber)'  },
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

// Thông báo thanh toán trong modal khi thay đổi trạng thái
const PAYMENT_NOTE = {
  da_giao:  { text: 'Thanh toán → Đã thanh toán',   color: '#22c55e' },
  hoan_tien:{ text: 'Thanh toán → Đã hoàn tiền',    color: '#a78bfa' },
};
const DEFAULT_PAYMENT_NOTE = { text: 'Thanh toán → Chưa thanh toán', color: '#f59e0b' };

// ─── Modal xác nhận ────────────────────────────────────────────
function ConfirmModal({ order, newStatus, onConfirm, onCancel }) {
  if (!order || !newStatus) return null;
  const sc = STATUS_COLORS[newStatus] || {};
  const pn = PAYMENT_NOTE[newStatus] || DEFAULT_PAYMENT_NOTE;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface-1)', borderRadius: 12,
        padding: 28, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Xác nhận thay đổi</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
          Bạn muốn chuyển đơn hàng <strong style={{ color: 'var(--accent)' }}>{order.order_code}</strong> sang trạng thái:
        </p>
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 8,
          background: sc.bg, color: sc.color, fontWeight: 700, textAlign: 'center',
          fontSize: '1rem', border: `1px solid ${sc.color}40`,
        }}>
          {STATUS_LABELS[newStatus]}
        </div>
        {/* Thông báo thay đổi thanh toán */}
        <div style={{
          padding: '8px 14px', borderRadius: 8, marginBottom: 20,
          background: `${pn.color}18`, color: pn.color,
          fontSize: '0.8rem', fontWeight: 600, textAlign: 'center',
        }}>
          {pn.text}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Hủy bỏ</button>
          <button className="btn btn-primary btn-sm" onClick={onConfirm}
            style={{ background: sc.color, borderColor: sc.color }}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Badge thanh toán ───────────────────────────────────────────
function PaymentBadge({ status }) {
  const cfg = PAYMENT_DISPLAY[status] || PAYMENT_DISPLAY.chua_tt;
  return <span style={{ fontSize: '0.78rem', fontWeight: 600, color: cfg.color }}>{cfg.label}</span>;
}

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState('');
  const [search,   setSearch]   = useState('');
  const [updating, setUpdating] = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getOrders({ status, search })
      .then(r => setOrders(r.data.data || []))
      .catch(() => toast.error('Không thể tải danh sách đơn hàng!'))
      .finally(() => setLoading(false));
  }, [status, search]);

  useEffect(() => {
    document.title = 'Đơn hàng – Admin';
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [status, search, load]);

  const requestStatusChange = (order, newStatus) => {
    if (newStatus === order.status) return;
    setConfirm({ order, newStatus });
  };

  const doStatusChange = async () => {
    if (!confirm) return;
    const { order, newStatus } = confirm;
    setConfirm(null);
    setUpdating(order.id);
    try {
      await adminApi.updateOrderStatus(order.id, newStatus);
      toast.success(`Đã chuyển sang: ${STATUS_LABELS[newStatus]}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <ConfirmModal
        order={confirm?.order}
        newStatus={confirm?.newStatus}
        onConfirm={doStatusChange}
        onCancel={() => setConfirm(null)}
      />

      <div style={{ padding: 24 }}>
        <div className="admin-topbar">
          <h1 className="admin-title">📦 Quản lý đơn hàng</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {orders.length} đơn hàng
          </span>
        </div>

        {/* Bộ lọc */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="Tìm mã đơn, tên khách hàng..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-control"
            style={{ maxWidth: 200 }}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Bảng */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                Không tìm thấy đơn hàng nào
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Thay đổi trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const sc = STATUS_COLORS[o.status] || { bg: 'transparent', color: 'var(--text-muted)' };
                    const isUpdating = updating === o.id;
                    return (
                      <tr key={o.id} style={{ opacity: isUpdating ? 0.6 : 1, transition: 'opacity .2s' }}>
                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{o.order_code}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.receiver_phone}</div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{fmt(o.total_amount)}</td>
                        <td><PaymentBadge status={o.payment_status} /></td>
                        <td>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px',
                            borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                            background: sc.bg, color: sc.color,
                          }}>
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(o.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <select
                            value={o.status}
                            disabled={isUpdating}
                            onChange={e => requestStatusChange(o, e.target.value)}
                            style={{
                              background: 'var(--surface-3)', border: '1px solid var(--border)',
                              borderRadius: 6, padding: '5px 10px', color: 'var(--text-primary)',
                              fontSize: '0.78rem', cursor: isUpdating ? 'wait' : 'pointer',
                              minWidth: 150,
                            }}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          {isUpdating && (
                            <span style={{ marginLeft: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Đang cập nhật...
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
