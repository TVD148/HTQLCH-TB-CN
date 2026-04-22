import { useState, useEffect } from 'react';
import { Shield, X, Filter, ChevronDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

// ── Status config — dùng đúng giá trị DB ──────────────────────
const STATUS_MAP = {
  cho_xu_ly:    { label: 'Chờ xử lý',     color: '#f59e0b', bg: '#f59e0b22' },
  da_tiep_nhan: { label: 'Đã tiếp nhận',  color: '#3b82f6', bg: '#3b82f622' },
  dang_xu_ly:   { label: 'Đang xử lý',    color: '#8b5cf6', bg: '#8b5cf622' },
  hoan_thanh:   { label: 'Đã giải quyết', color: '#22c55e', bg: '#22c55e22' },
  tu_choi:      { label: 'Từ chối',        color: '#ef4444', bg: '#ef444422' },
};

const SHIP_MAP = {
  buu_dien:    '📦 Gửi bưu điện',
  ship_ve:     '🚚 Ship tận nhà',
  den_cua_hang:'🏪 Đến cửa hàng',
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, color: '#6b7280', bg: '#6b728022' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
      background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export default function AdminWarranty() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ status: 'da_tiep_nhan', note: '' });
  const [filterStatus, setFilterStatus] = useState('');

  const load = async (status = filterStatus) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const r = await axios.get(`${API}/admin/warranty`, { ...getAuth(), params });
      setRequests(r.data.data || []);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { document.title = 'Bảo hành – Admin'; load(); }, []);

  const handleFilterChange = (val) => {
    setFilterStatus(val);
    load(val);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/admin/warranty/${selected.id}/status`,
        { status: form.status, resolution_note: form.note }, getAuth());
      toast.success('Đã cập nhật trạng thái bảo hành!');
      setSelected(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi!'); }
  };

  // Stats
  const stats = Object.entries(STATUS_MAP).map(([k, v]) => ({
    key: k, label: v.label, color: v.color, count: requests.filter(r => r.status === k).length,
  }));

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={22} color="var(--accent)" /> Quản lý bảo hành
        </h2>

        {/* Bộ lọc trạng thái */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} color="var(--text-muted)" />
          <div style={{ position: 'relative' }}>
            <select
              className="form-control"
              style={{ paddingRight: 32, fontSize: '0.85rem', minWidth: 160 }}
              value={filterStatus}
              onChange={e => handleFilterChange(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.key} className="card" style={{ cursor: 'pointer', border: filterStatus === s.key ? `2px solid ${s.color}` : '2px solid var(--border)' }}
            onClick={() => handleFilterChange(filterStatus === s.key ? '' : s.key)}>
            <div className="card-body" style={{ textAlign: 'center', padding: '14px 10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : requests.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Shield size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontWeight: 600 }}>Chưa có yêu cầu bảo hành</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)' }}>
                  {['Sản phẩm', 'Khách hàng', 'Hình thức gửi', 'Lý do', 'Ngày tạo', 'Trạng thái', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '0.88rem', minWidth: 160 }}>{r.product_name}</td>
                    <td style={{ padding: '12px 14px', minWidth: 130 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.contact_phone || r.phone}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      <span style={{ background: 'var(--surface-3)', padding: '3px 8px', borderRadius: 6 }}>
                        {SHIP_MAP[r.shipping_method] || r.shipping_method}
                      </span>
                      {r.appointment_time && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          🕐 {new Date(r.appointment_time).toLocaleString('vi-VN')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.issue_description}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(r.received_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <button className="btn btn-outline btn-sm"
                        onClick={() => { setSelected(r); setForm({ status: r.status, note: r.resolution_note || '' }); }}>
                        Xử lý
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal xử lý */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal__header">
              <span className="modal__title">Xử lý bảo hành #{selected.id}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal__body" style={{ display: 'grid', gap: 14 }}>
              {/* Thông tin yêu cầu */}
              <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: 14, display: 'grid', gap: 6 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selected.product_name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Khách: <strong>{selected.customer_name}</strong> — {selected.contact_phone || selected.phone}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Lý do: {selected.issue_description}</div>
                <div style={{ fontSize: '0.82rem', marginTop: 4 }}>
                  <span style={{ background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem' }}>
                    {SHIP_MAP[selected.shipping_method] || selected.shipping_method}
                  </span>
                  {selected.appointment_time && (
                    <span style={{ marginLeft: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      🕐 {new Date(selected.appointment_time).toLocaleString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleUpdate} style={{ display: 'grid', gap: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cập nhật trạng thái</label>
                  <select className="form-control" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {Object.entries(STATUS_MAP).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Ghi chú cho khách <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(sẽ gửi thông báo tới khách)</span></label>
                  <textarea className="form-control" rows={3} value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="Kết quả kiểm tra, thời gian xử lý dự kiến..." />
                </div>
                <div className="modal__footer" style={{ padding: 0 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Hủy</button>
                  <button type="submit" className="btn btn-primary btn-sm">Lưu & Gửi thông báo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
