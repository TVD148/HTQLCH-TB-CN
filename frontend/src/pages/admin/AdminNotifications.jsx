import { useState, useEffect } from 'react';
import { Bell, Send, Calendar, Users, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3001/api';
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function AdminNotifications() {
  const [form, setForm]       = useState({ title: '', content: '', type: 'su_kien', voucher_id: '' });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => { fetchHistory(); fetchVouchers(); }, []);

  const fetchHistory = async () => {
    try {
      const r = await axios.get(`${API}/admin/notifications/broadcast`, getAuthHeader());
      setHistory(r.data.data || []);
    } catch (_) {}
  };

  const fetchVouchers = async () => {
    try {
      const r = await axios.get(`${API}/admin/vouchers`, getAuthHeader());
      setVouchers((r.data.data || []).filter(v => v.voucher_type === 'promo_code'));
    } catch (_) {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error('Vui lòng nhập tiêu đề và nội dung'); return; }
    setSending(true);
    try {
      const payload = { title: form.title, content: form.content, type: form.type };
      if (form.voucher_id) payload.voucher_id = form.voucher_id;
      const r = await axios.post(`${API}/admin/notifications/broadcast`, payload, getAuthHeader());
      toast.success(r.data.message || 'Đã gửi thông báo!');
      setForm({ title: '', content: '', type: 'su_kien', voucher_id: '' });
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gửi thông báo');
    } finally { setSending(false); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Bell size={22} /> Gửi thông báo đến người dùng
      </h2>

      {/* Form tạo thông báo */}
      <div className="card" style={{ marginBottom: 28, overflow: 'visible' }}>
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: '1rem' }}>Tạo thông báo mới</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Loại thông báo</label>
              <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="su_kien">🎉 Sự kiện</option>
                <option value="khuyen_mai">🏷️ Khuyến mãi</option>
                <option value="he_thong">⚙️ Hệ thống</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Voucher sự kiện kèm theo (tuỳ chọn)</label>
              <select className="form-control" value={form.voucher_id} onChange={e => setForm({ ...form, voucher_id: e.target.value })}>
                <option value="">— Không kèm voucher —</option>
                {vouchers.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (Mã: {v.code})</option>
                ))}
              </select>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Chỉ hiển thị voucher loại <strong>Mã sự kiện (promo_code)</strong>. Hãy nhập mã vào nội dung thông báo để người dùng biết cách dùng.
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tiêu đề *</label>
              <input className="form-control" placeholder="VD: 🎉 Flash Sale cuối tuần — Giảm đến 50%!"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nội dung *</label>
              <textarea className="form-control" rows={5}
                placeholder="Nhập nội dung thông báo. Nếu có mã sự kiện hãy ghi rõ: VD: Dùng mã FLASH50 khi thanh toán để được giảm giá!"
                value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required
                style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={sending}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} /> {sending ? 'Đang gửi...' : 'Gửi đến tất cả người dùng'}
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={13} /> Gửi tới tất cả tài khoản khách hàng đang hoạt động
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Lịch sử */}
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Lịch sử thông báo đã gửi</h3>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.9rem' }}>
              Chưa có thông báo nào được gửi
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                  <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{h.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{h.content}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} /> {fmtDate(h.created_at)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={11} /> {h.sent_count} người nhận
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
