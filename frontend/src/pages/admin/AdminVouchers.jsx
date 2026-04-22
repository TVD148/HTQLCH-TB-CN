import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Send } from 'lucide-react';
import { adminApi, voucherApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const emptyForm = {
  code: '', name: '', description: '',
  voucher_type: 'product',
  discount_type: 'percent', discount_value: '',
  max_discount_amount: '', min_order_value: 0,
  max_uses: 100, max_uses_per_user: 1,
  start_date: '', expired_at: '',
};

// Auto-tạo mã cho voucher sản phẩm/vận chuyển
const autoCode = (type) => {
  const prefix = type === 'shipping' ? 'SHIP' : 'SALE';
  return `${prefix}${Date.now().toString().slice(-6)}`;
};

const TYPE_LABELS = { percent: '% Phần trăm', fixed_amount: 'Số tiền cố định', freeship: '🚚 Miễn phí ship' };
const TYPE_COLORS = { percent: 'var(--accent)', fixed_amount: 'var(--emerald)', freeship: 'var(--amber)' };
const VOUCHER_TYPE_LABELS = { product: 'Sản phẩm', shipping: 'Vận chuyển', promo_code: 'Mã sự kiện' };
const VOUCHER_TYPE_COLORS = { product: 'var(--accent)', shipping: 'var(--emerald)', promo_code: '#8B5CF6' };

export default function AdminVouchers() {
  const [vouchers,   setVouchers]   = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendVoucherId, setSendVoucherId] = useState('');
  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [sending,    setSending]    = useState(false);

  const load = () => adminApi.getVouchers().then(r => setVouchers(r.data.data));
  useEffect(() => { document.title = 'Voucher – Admin'; load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminApi.updateVoucher(editId, form);
        toast.success('Cập nhật voucher thành công!');
      } else {
        await adminApi.createVoucher(form);
        toast.success('Tạo voucher thành công!');
      }
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra!'); }
  };

  const openEdit = (v) => {
    setForm({ ...v, start_date: v.start_date?.slice(0, 16) || '', expired_at: v.expired_at?.slice(0, 16) || '' });
    setEditId(v.id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận vô hiệu hóa voucher này?')) return;
    await adminApi.deleteVoucher(id); toast.success('Đã vô hiệu hóa!'); load();
  };

  const handleSendWeekly = async () => {
    if (!sendVoucherId) { toast.error('Chọn voucher để gửi!'); return; }
    setSending(true);
    try {
      const res = await voucherApi.sendWeekly(sendVoucherId);
      toast.success(res.data.message || 'Gửi thành công!');
      setShowSendModal(false); setSendVoucherId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi thất bại!');
    } finally { setSending(false); }
  };

  const renderDiscountCell = (v) => {
    if (v.discount_type === 'freeship') return <span style={{ color: 'var(--amber)', fontWeight: 700 }}>Miễn ship</span>;
    if (v.discount_type === 'percent')  return <>{v.discount_value}% {v.max_discount_amount && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(max {fmt(v.max_discount_amount)})</span>}</>;
    return <span style={{ fontWeight: 700 }}>{fmt(v.discount_value)}</span>;
  };

  // Sắp xếp: còn hạn lên trước, hết hạn xuống cuối
  const now = new Date();
  const isExpired = (v) => v.expired_at && new Date(v.expired_at) < now;
  const sortedVouchers = [...vouchers].sort((a, b) => {
    const aExp = isExpired(a) ? 1 : 0;
    const bExp = isExpired(b) ? 1 : 0;
    return aExp - bExp;
  });
  const expiredCount = vouchers.filter(isExpired).length;

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🏷️ Quản lý Voucher</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" style={{ color: 'var(--amber)', borderColor: 'var(--amber)' }}
            onClick={() => setShowSendModal(true)}>
            <Send size={14} /> Gửi hàng tuần
          </button>
          <button className="btn btn-primary btn-sm"
            onClick={() => { setForm({...emptyForm, code: autoCode('product')}); setEditId(null); setShowModal(true); }}>
            <Plus size={14} /> Tạo voucher mới
          </button>
        </div>
      </div>

      {/* ─── Layout: 3 phần dọc — active 2 phần, expired 1 phần ─── */}
      <div style={{ display: 'grid', gridTemplateRows: '2fr 1fr', gap: 16, minHeight: 0 }}>

        {/* ─── PHẦN 1: Voucher đang hoạt động ─── */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>✅ Voucher đang hoạt động</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {vouchers.filter(v => !isExpired(v)).length} voucher
            </span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th><th>Tên</th><th>Loại Voucher</th><th>Loại giảm</th><th>Giảm</th>
                  <th>Đơn tối thiểu</th><th>Lượt dùng</th><th>Hết hạn</th><th>Trạng thái</th><th></th>
                </tr>
              </thead>
              <tbody>
                {vouchers.filter(v => !isExpired(v)).map(v => (
                  <tr key={v.id}>
                    <td>
                      <code style={{ background: 'var(--surface-3)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'var(--accent)' }}>
                        {v.code}
                      </code>
                    </td>
                    <td>{v.name}</td>
                    <td>
                      <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, background:`${VOUCHER_TYPE_COLORS[v.voucher_type]||'var(--accent)'}22`, color:VOUCHER_TYPE_COLORS[v.voucher_type]||'var(--accent)', fontSize:'0.72rem', fontWeight:700 }}>
                        {VOUCHER_TYPE_LABELS[v.voucher_type] || v.voucher_type}
                      </span>
                    </td>
                    <td>
                      <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, background:`${TYPE_COLORS[v.discount_type]}22`, color:TYPE_COLORS[v.discount_type], fontSize:'0.72rem', fontWeight:700 }}>
                        {TYPE_LABELS[v.discount_type]}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{renderDiscountCell(v)}</td>
                    <td>{v.min_order_value > 0 ? fmt(v.min_order_value) : <span style={{ color: 'var(--text-muted)' }}>Không yêu cầu</span>}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.used_count}/{v.max_uses}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(v.expired_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`badge ${v.is_active ? 'badge-delivered' : 'badge-cancelled'}`}>
                        {v.is_active ? 'Hoạt động' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)}><Pencil size={13} /></button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(v.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {vouchers.filter(v => !isExpired(v)).length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Chưa có voucher nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── PHẦN 2: Voucher hết hạn ─── */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.06)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--red)' }}>⏰ Voucher hết hạn</span>
            {expiredCount > 0 && (
              <span style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red)', borderRadius: 20, padding: '1px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                {expiredCount}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Xóa các voucher không cần thiết để dọn dẹp</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th><th>Tên</th><th>Loại Voucher</th><th>Loại giảm</th><th>Giảm</th>
                  <th>Lượt dùng</th><th>Hết hạn lúc</th><th>Trạng thái</th><th></th>
                </tr>
              </thead>
              <tbody>
                {vouchers.filter(isExpired).map(v => (
                  <tr key={v.id} style={{ opacity: 0.8 }}>
                    <td>
                      <code style={{ background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'var(--red)' }}>
                        {v.code}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.name}</td>
                    <td>
                      <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, background:'rgba(239,68,68,0.08)', color:'var(--red)', fontSize:'0.72rem', fontWeight:700 }}>
                        {VOUCHER_TYPE_LABELS[v.voucher_type] || v.voucher_type}
                      </span>
                    </td>
                    <td>
                      <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, background:`${TYPE_COLORS[v.discount_type]}22`, color:TYPE_COLORS[v.discount_type], fontSize:'0.72rem', fontWeight:700 }}>
                        {TYPE_LABELS[v.discount_type]}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{renderDiscountCell(v)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.used_count}/{v.max_uses}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--red)', fontWeight: 700 }}>
                      {new Date(v.expired_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className="badge badge-cancelled">Hết hạn</span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(v.id)} title="Xóa">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {expiredCount === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    🎉 Không có voucher hết hạn
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* ── Modal Tạo/Sửa Voucher ─── */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal__header">
              <span className="modal__title">{editId ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body" style={{ display: 'grid', gap: 12 }}>

                {/* Loại Voucher — đặt lên đầu để điều khiển các field bên dưới */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Loại Voucher *</label>
                    <select className="form-control" value={form.voucher_type}
                      onChange={e => {
                        const vt = e.target.value;
                        setForm(f => ({
                          ...f,
                          voucher_type: vt,
                          // Tự sinh mã nếu không phải sự kiện
                          code: vt !== 'promo_code' ? autoCode(vt) : f.code,
                        }));
                      }}>
                      <option value="product">📦 Sản phẩm</option>
                      <option value="shipping">🚚 Vận chuyển</option>
                      <option value="promo_code">🎉 Mã sự kiện</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Loại giảm</label>
                    <select className="form-control" value={form.discount_type}
                      onChange={e => setForm({ ...form, discount_type: e.target.value })}>
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed_amount">Số tiền cố định (đ)</option>
                      <option value="freeship">🚚 Miễn phí vận chuyển</option>
                    </select>
                  </div>
                </div>

                {/* Mã sự kiện: nhập tay mã; Sản phẩm/Vận chuyển: tự sinh */}
                {form.voucher_type === 'promo_code' ? (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Mã voucher sự kiện *</label>
                    <input className="form-control" required value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="VD: SALE15K, BIRTHDAY2026" />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                      Khách hàng nhập mã này khi thanh toán
                    </div>
                  </div>
                ) : (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Mã tự động</label>
                    <input className="form-control" value={form.code} readOnly
                      style={{ background: 'var(--surface-3)', color: 'var(--text-muted)', cursor: 'not-allowed' }}/>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>🔒 Sinh tự động</div>
                  </div>
                )}

                {/* Tên hiển thị: chỉ cần cho Sản phẩm/Vận chuyển */}
                {form.voucher_type !== 'promo_code' && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tên hiển thị</label>
                    <input className="form-control" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Flash Sale 15%" />
                  </div>
                )}

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Mô tả (hiển thị cho người dùng)</label>
                  <input className="form-control" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Áp dụng cho tất cả đơn hàng trong tuần này" />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    {form.discount_type === 'percent'
                      ? 'Giá trị giảm (%) *'
                      : form.discount_type === 'freeship'
                      ? 'Phí ship được miễn (đ) — để trống = miễn toàn bộ'
                      : 'Số tiền giảm cố định (đ) *'}
                  </label>
                  <input className="form-control" type="number"
                    required={form.discount_type !== 'freeship'}
                    value={form.discount_value}
                    onChange={e => setForm({ ...form, discount_value: e.target.value })}
                    placeholder={form.discount_type === 'percent' ? '15 (%)' : form.discount_type === 'freeship' ? '30000' : '50000'} />
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:3}}>
                    {form.discount_type === 'percent' && 'Nhập số phần trăm, VD: 10 = giảm 10%'}
                    {form.discount_type === 'fixed_amount' && 'Nhập số tiền bằng VNĐ, VD: 50000 = giảm 50.000đ'}
                    {form.discount_type === 'freeship' && 'Miễn toàn bộ phí ship cho đơn hàng'}
                  </div>
                </div>

                {form.discount_type === 'percent' && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Giảm tối đa (đ) — để trống = không giới hạn</label>
                    <input className="form-control" type="number" value={form.max_discount_amount}
                      onChange={e => setForm({ ...form, max_discount_amount: e.target.value })}
                      placeholder="200000" />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Áp dụng cho đơn hàng từ (đ)</label>
                    <input className="form-control" type="number" value={form.min_order_value}
                      onChange={e => setForm({ ...form, min_order_value: e.target.value })}
                      placeholder="0 = không giới hạn" />
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:3}}>VD: 500000 = đơn từ 500.000đ trở lên</div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tổng lượt dùng tối đa</label>
                    <input className="form-control" type="number" value={form.max_uses}
                      onChange={e => setForm({ ...form, max_uses: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ngày bắt đầu</label>
                    <input className="form-control" type="datetime-local" value={form.start_date}
                      onChange={e => setForm({ ...form, start_date: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ngày hết hạn *</label>
                    <input className="form-control" type="datetime-local" required value={form.expired_at}
                      onChange={e => setForm({ ...form, expired_at: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">{editId ? 'Cập nhật' : 'Tạo voucher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Gửi Voucher Hàng Tuần ─── */}
      {showSendModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSendModal(false)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal__header">
              <span className="modal__title">📨 Gửi Voucher cho tất cả người dùng</span>
              <button onClick={() => setShowSendModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal__body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Gửi voucher đã chọn tới <strong>tất cả user đang hoạt động</strong> qua thông báo. Thường dùng cho voucher freeship hàng tuần.
              </p>
              <div className="form-group">
                <label className="form-label">Chọn Voucher để gửi</label>
                <select className="form-control" value={sendVoucherId}
                  onChange={e => setSendVoucherId(e.target.value)}>
                  <option value="">-- Chọn voucher --</option>
                  {vouchers.filter(v => v.is_active).map(v => (
                    <option key={v.id} value={v.id}>
                      [{TYPE_LABELS[v.discount_type]}] {v.code} — {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{
                padding: '10px 14px', background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem', color: 'var(--amber)',
              }}>
                ⚠️ Voucher sẽ được thêm vào thông báo của từng người dùng. Người dùng sẽ thấy khi mở thông báo.
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowSendModal(false)}>Hủy</button>
              <button type="button" className="btn btn-primary btn-sm" disabled={sending || !sendVoucherId} onClick={handleSendWeekly}>
                <Send size={14} /> {sending ? 'Đang gửi...' : 'Gửi cho tất cả'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
