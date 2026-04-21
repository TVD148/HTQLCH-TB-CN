import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, voucherApi } from '../api';
import toast from 'react-hot-toast';
import { Tag, ChevronDown, ChevronUp, CheckCircle2, XCircle, Coins } from 'lucide-react';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

function VoucherPicker({ cartTotal, onSelect, selected }) {
  const [vouchers, setVouchers]   = useState([]);
  const [loading,  setLoading]    = useState(false);
  const [open,     setOpen]       = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    voucherApi.getAvailable(cartTotal)
      .then(r => setVouchers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, cartTotal]);

  const TYPE_LABEL = {
    percent:      '% Giảm',
    fixed_amount: 'Giảm tiền',
    freeship:     '🚚 Miễn ship',
  };
  const TYPE_COLOR = {
    percent:      'var(--accent)',
    fixed_amount: 'var(--emerald)',
    freeship:     'var(--amber)',
  };

  return (
    <div className="voucher-picker">
      <div className="voucher-picker__trigger" onClick={() => setOpen(v => !v)}>
        <Tag size={16} style={{ color: 'var(--accent)' }} />
        {selected ? (
          <span style={{ flex: 1, fontWeight: 600, color: 'var(--emerald)' }}>
            ✓ {selected.code} — {selected.name}
          </span>
        ) : (
          <span style={{ flex: 1, color: 'var(--text-muted)' }}>Chọn voucher giảm giá...</span>
        )}
        {selected && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(null); }}
            style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          >
            <XCircle size={15} />
          </button>
        )}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </div>

      {open && (
        <div className="voucher-picker__dropdown">
          {loading && <div style={{ padding: 16, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đang tải voucher...</div>}
          {!loading && vouchers.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Bạn chưa có voucher nào phù hợp 😊<br />
              <span style={{ fontSize: '0.78rem' }}>Voucher miễn ship được gửi hàng tuần qua thông báo</span>
            </div>
          )}
          {vouchers.map(v => (
            <div
              key={v.id}
              className={`voucher-picker__item${!v.eligible || v.already_used ? ' disabled' : ''}${selected?.id === v.id ? ' selected' : ''}`}
              onClick={() => {
                if (!v.eligible || v.already_used) return;
                onSelect(v);
                setOpen(false);
              }}
            >
              <div className="voucher-picker__item-left">
                <span className="voucher-picker__badge" style={{ background: TYPE_COLOR[v.discount_type] }}>
                  {TYPE_LABEL[v.discount_type]}
                </span>
                <div>
                  <div className="voucher-picker__code">{v.code}</div>
                  <div className="voucher-picker__name">{v.name}</div>
                  {v.description && <div className="voucher-picker__desc">{v.description}</div>}
                </div>
              </div>
              <div className="voucher-picker__item-right">
                {v.discount_type === 'freeship' ? (
                  <div className="voucher-picker__amount" style={{ color: 'var(--amber)' }}>Miễn ship</div>
                ) : (
                  <div className="voucher-picker__amount" style={{ color: 'var(--emerald)' }}>
                    -{fmt(v.discount_amount)}
                  </div>
                )}
                {v.min_order > 0 && (
                  <div className="voucher-picker__min">
                    Đơn từ {fmt(v.min_order)}
                  </div>
                )}
                {!v.eligible && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: 2 }}>
                    Chưa đủ điều kiện
                  </div>
                )}
                {v.already_used && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: 2 }}>
                    Đã sử dụng
                  </div>
                )}
                {v.is_personal && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--amber)', marginTop: 2 }}>
                    🎁 Voucher của bạn
                  </div>
                )}
                {selected?.id === v.id && <CheckCircle2 size={15} color="var(--emerald)" style={{ marginTop: 4 }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    receiver_name:    user?.name || '',
    receiver_phone:   user?.phone || '',
    shipping_address: user?.address || '',
    payment_method:   'cod',
    note:             '',
  });

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [pointsToUse,     setPointsToUse]     = useState(0);
  const [loading,         setLoading]          = useState(false);

  const voucherDiscount = selectedVoucher?.discount_amount || 0;
  const maxPoints       = Math.min(user?.loyalty_points || 0, Math.floor((finalTotal - voucherDiscount) / 1000));
  const pointsDiscount  = pointsToUse * 1000;
  const grandTotal      = Math.max(0, finalTotal - voucherDiscount - pointsDiscount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiver_name || !form.receiver_phone || !form.shipping_address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng!'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        voucher_id:            selectedVoucher?.id || null,
        loyalty_points_used:   pointsToUse,
      };
      const res = await orderApi.create(payload);
      clearCart?.();
      toast.success(`Đặt hàng thành công! Mã đơn: ${res.data.data.order_code} 🎉`);
      navigate(`/orders/${res.data.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại!');
    } finally { setLoading(false); }
  };

  // Reset points khi voucher thay doi
  useEffect(() => { setPointsToUse(0); }, [selectedVoucher]);

  return (
    <div className="section"><div className="container">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 28 }}>📦 Thanh toán</h1>
      <form onSubmit={handleSubmit}>
        <div className="cart-layout">
          {/* ── LEFT: FORM ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Shipping Info */}
            <div className="card"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Thông tin giao hàng</h3>
              {[
                { k: 'receiver_name',    l: 'Họ và tên người nhận', t: 'text', p: 'Nguyễn Văn A' },
                { k: 'receiver_phone',   l: 'Số điện thoại',        t: 'tel',  p: '0901234567' },
                { k: 'shipping_address', l: 'Địa chỉ giao hàng',    t: 'text', p: 'Số nhà, đường, phường/xã, Q/H, tỉnh/TP' },
              ].map(f => (
                <div key={f.k} className="form-group">
                  <label className="form-label">{f.l}</label>
                  <input className="form-control" type={f.t} placeholder={f.p} value={form[f.k]}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })} required />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows={3} placeholder="Ghi chú đặc biệt cho đơn hàng (nếu có)..."
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
            </div></div>

            {/* Payment Method */}
            <div className="card"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Phương thức thanh toán</h3>
              {[
                { v: 'cod',           l: '💵 Thanh toán khi nhận hàng (COD)' },
                { v: 'bank_transfer', l: '🏦 Chuyển khoản ngân hàng' },
                { v: 'momo',          l: '💜 Ví MoMo' },
              ].map(m => (
                <label key={m.v} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                  <input type="radio" name="payment" value={m.v} checked={form.payment_method === m.v}
                    onChange={e => setForm({ ...form, payment_method: e.target.value })} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem' }}>{m.l}</span>
                </label>
              ))}
            </div></div>

            {/* Voucher Picker */}
            <div className="card"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag size={18} /> Mã giảm giá / Voucher
              </h3>
              <VoucherPicker
                cartTotal={finalTotal}
                selected={selectedVoucher}
                onSelect={setSelectedVoucher}
              />
              {selectedVoucher && (
                <div style={{
                  marginTop: 10, padding: '10px 14px',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
                }}>
                  ✅ Đã áp dụng <strong>{selectedVoucher.code}</strong>:{' '}
                  {selectedVoucher.discount_type === 'freeship'
                    ? 'Miễn phí vận chuyển'
                    : `Giảm ${fmt(selectedVoucher.discount_amount)}`}
                </div>
              )}
              <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                💡 Voucher miễn ship được gửi tự động qua thông báo mỗi tuần
              </p>
            </div></div>

            {/* Loyalty Points */}
            {user?.loyalty_points > 0 && (
              <div className="card"><div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Coins size={18} /> Dùng điểm tích lũy
                </h3>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                  padding: '8px 12px', background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                }}>
                  ⭐ Bạn có <strong style={{ color: 'var(--amber)', margin: '0 4px' }}>{user.loyalty_points} điểm</strong>
                  = <strong style={{ color: 'var(--amber)', margin: '0 4px' }}>{fmt(user.loyalty_points * 1000)}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>(mua 100K = 1 điểm = 1.000đ)</span>
                </div>

                <input
                  type="range" min={0} max={maxPoints} value={pointsToUse}
                  onChange={e => setPointsToUse(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--amber)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>0 điểm</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
                    Dùng {pointsToUse} điểm → giảm {fmt(pointsDiscount)}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{maxPoints} điểm tối đa</span>
                </div>

                {/* Quick buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {[0, Math.floor(maxPoints * 0.25), Math.floor(maxPoints * 0.5), maxPoints].map(v => (
                    <button key={v} type="button"
                      className={`btn btn-sm ${pointsToUse === v ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      onClick={() => setPointsToUse(v)}
                    >
                      {v === 0 ? 'Không dùng' : v === maxPoints ? 'Dùng tối đa' : `${v} điểm`}
                    </button>
                  ))}
                </div>
              </div></div>
            )}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ─────────────────────── */}
          <div className="order-summary-card">
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Đơn hàng của bạn</div>
            <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
              {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <img src={item.thumbnail} alt={item.name}
                    style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, background: 'var(--surface-3)' }}
                    onError={e => { e.target.src = 'https://placehold.co/48x36/1E293B/3B82F6?text=IMG'; }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>x{item.quantity}</div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>{fmt(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Price rows */}
            <div className="summary-row"><span>Tạm tính</span><span>{fmt(finalTotal)}</span></div>
            {selectedVoucher && (
              <div className="summary-row discount">
                <span>Voucher ({selectedVoucher.code})</span>
                <span>
                  {selectedVoucher.discount_type === 'freeship'
                    ? 'Miễn ship'
                    : `-${fmt(selectedVoucher.discount_amount)}`}
                </span>
              </div>
            )}
            {pointsToUse > 0 && (
              <div className="summary-row" style={{ color: 'var(--amber)' }}>
                <span>⭐ Điểm tích lũy ({pointsToUse} điểm)</span>
                <span>-{fmt(pointsDiscount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span style={{ color: 'var(--emerald)' }}>Miễn phí</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span style={{ color: 'var(--accent)', fontSize: '1.3rem' }}>{fmt(grandTotal)}</span>
            </div>

            {/* Points earn preview */}
            {grandTotal > 0 && (
              <div style={{
                marginTop: 12, padding: '8px 12px',
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--amber)',
              }}>
                🎯 Đơn này bạn sẽ nhận được <strong>{Math.floor(grandTotal / 100000)} điểm</strong> tích lũy
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: 16, height: 48, fontSize: '1rem' }}
              disabled={loading || !cart.items.length}
            >
              {loading ? 'Đang xử lý...' : '🎉 Đặt hàng ngay'}
            </button>
          </div>
        </div>
      </form>
    </div></div>
  );
}
