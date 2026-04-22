import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, voucherApi, addressApi } from '../api';
import toast from 'react-hot-toast';
import { Tag, ChevronDown, ChevronUp, CheckCircle2, XCircle, Coins, X, MapPin, Plus, Home, Briefcase, Map } from 'lucide-react';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

/* ── Voucher Info Modal ────────────────────────────────────── */
function VoucherInfoModal({ voucher, onClose }) {
  if (!voucher) return null;

  const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const getDiscountLabel = (v) => {
    if (v.discount_type === 'percent') {
      return `Giảm ${v.discount_value}%${v.max_discount ? ` (tối đa ${fmt(v.max_discount)})` : ''}`;
    } else if (v.discount_type === 'fixed_amount') {
      return `Giảm ${fmt(v.discount_value)}`;
    } else if (v.discount_type === 'freeship') {
      return `Miễn phí vận chuyển`;
    }
    return v.name;
  };

  const getConditionText = (v) => {
    const parts = [];
    if (v.min_order > 0) parts.push(`Áp dụng cho đơn hàng từ ${fmt(v.min_order)} trở lên`);
    parts.push('Mỗi tài khoản chỉ sử dụng được 1 lần');
    return parts;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface-1)',
          borderRadius: 10,
          overflow: 'hidden',
          width: '100%', maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          animation: 'fadeInUp 0.2s ease',
        }}
      >
        {/* Header đỏ */}
        <div style={{
          background: '#e53e3e',
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
            Thông tin voucher
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: '50%',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Tên voucher:', value: voucher.name },
            { label: 'Loại:', value: getDiscountLabel(voucher) },
            {
              label: 'Ngày hết hạn:',
              value: voucher.expires_at
                ? new Date(voucher.expires_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'Không giới hạn',
            },
            {
              label: 'Điều kiện:',
              value: getConditionText(voucher),
              isList: true,
            },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{
                color: '#e53e3e', fontWeight: 600, fontSize: '0.88rem',
                minWidth: 110, flexShrink: 0, paddingTop: 2,
              }}>
                {row.label}
              </span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {row.isList
                  ? row.value.map((t, i) => <div key={i}>{t}</div>)
                  : <strong>{row.value}</strong>
                }
              </div>
            </div>
          ))}

          {/* Trạng thái */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ color: '#e53e3e', fontWeight: 600, fontSize: '0.88rem', minWidth: 110, flexShrink: 0 }}>
              Trạng thái:
            </span>
            {voucher.already_used ? (
              <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>❌ Đã sử dụng</span>
            ) : !voucher.eligible ? (
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>⚠️ Chưa đủ điều kiện</span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>✅ Có thể sử dụng</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            Đóng
          </button>
          {voucher.eligible && !voucher.already_used && (
            <button
              onClick={() => { voucher._onApply?.(); onClose(); }}
              className="btn btn-primary btn-sm"
              style={{ background: '#e53e3e', borderColor: '#e53e3e' }}
            >
              Áp dụng ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── VoucherPicker ─────────────────────────────────────────── */
function VoucherPicker({ cartTotal, onSelect, selected }) {
  const [vouchers, setVouchers]   = useState([]);
  const [loading,  setLoading]    = useState(false);
  const [open,     setOpen]       = useState(false);
  const [infoVoucher, setInfoVoucher] = useState(null); // voucher đang xem info

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

  const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <>
      {/* Modal thông tin voucher */}
      {infoVoucher && (
        <VoucherInfoModal
          voucher={infoVoucher}
          onClose={() => setInfoVoucher(null)}
        />
      )}

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
            {loading && (
              <div style={{ padding: 16, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Đang tải voucher...
              </div>
            )}
            {!loading && vouchers.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Bạn chưa có voucher nào phù hợp 😊<br />
                <span style={{ fontSize: '0.78rem' }}>Voucher miễn ship được gửi hàng tuần qua thông báo</span>
              </div>
            )}
            {vouchers.map(v => {
              const disabled = !v.eligible || v.already_used;
              return (
                <div
                  key={v.id}
                  className={`voucher-picker__item${disabled ? ' disabled' : ''}${selected?.id === v.id ? ' selected' : ''}`}
                >
                  {/* Left — click để chọn */}
                  <div
                    className="voucher-picker__item-left"
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer', flex: 1 }}
                    onClick={() => {
                      if (disabled) return;
                      onSelect(v);
                      setOpen(false);
                    }}
                  >
                    <span className="voucher-picker__badge" style={{ background: TYPE_COLOR[v.discount_type] }}>
                      {TYPE_LABEL[v.discount_type]}
                    </span>
                    <div>
                      <div className="voucher-picker__code">{v.code}</div>
                      <div className="voucher-picker__name">{v.name}</div>
                      {v.min_order > 0 && (
                        <div className="voucher-picker__desc">
                          Đơn tối thiểu {fmt(v.min_order)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="voucher-picker__item-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {/* Số tiền giảm */}
                    {v.discount_type === 'freeship' ? (
                      <div className="voucher-picker__amount" style={{ color: 'var(--amber)' }}>Miễn ship</div>
                    ) : (
                      <div className="voucher-picker__amount" style={{ color: 'var(--emerald)' }}>
                        -{fmt(v.discount_amount || v.discount_value)}
                      </div>
                    )}

                    {/* Trạng thái */}
                    {v.already_used && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600 }}>Đã sử dụng</div>
                    )}
                    {!v.already_used && !v.eligible && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600 }}>Chưa đủ ĐK</div>
                    )}
                    {v.is_personal && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>🎁 Của bạn</div>
                    )}
                    {selected?.id === v.id && <CheckCircle2 size={14} color="var(--emerald)" />}

                    {/* ℹ️ Info button */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setInfoVoucher({
                          ...v,
                          _onApply: () => { onSelect(v); setOpen(false); },
                        });
                      }}
                      title="Xem thông tin voucher"
                      style={{
                        background: 'none', border: '1px solid var(--border)',
                        borderRadius: 5, cursor: 'pointer',
                        padding: '2px 7px', fontSize: '0.72rem',
                        color: 'var(--text-muted)', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 3, marginTop: 2,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      ℹ️ Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ── MineVoucherPicker — chọn từ voucher đã nhận ─────────── */
function MineVoucherPicker({ type, cartTotal, selected, onSelect, placeholder }) {
  const [vouchers,  setVouchers]  = useState([]);
  const [open,      setOpen]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    voucherApi.getMine({ type, cart_total: cartTotal })
      .then(r => setVouchers((r.data.data || []).filter(v => !v.used && v.eligible)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, type, cartTotal]);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const TYPE_COLOR = { percent: 'var(--accent)', fixed_amount: 'var(--emerald)', freeship: 'var(--amber)' };

  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
        background: 'var(--surface-2)', cursor: 'pointer', minHeight: 44,
        transition: 'border-color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <Tag size={15} style={{ color: selected ? 'var(--emerald)' : 'var(--accent)', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '0.88rem', color: selected ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: selected ? 600 : 400 }}>
          {selected ? `✓ ${selected.name}` : placeholder}
        </span>
        {selected && (
          <button type="button" onClick={e => { e.stopPropagation(); onSelect(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 2 }}>
            <X size={14}/>
          </button>
        )}
        {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }}/> : <ChevronDown size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }}/>}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--surface-1)', border: '1.5px solid var(--accent)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          zIndex: 9999,
        }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đang tải...</div>
          ) : vouchers.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Không có voucher phù hợp
            </div>
          ) : vouchers.map(v => {
            const color = TYPE_COLOR[v.discount_type] || 'var(--accent)';
            const isSel = selected?.id === v.id;
            return (
              <div key={v.id} onClick={() => { onSelect(isSel ? null : v); setOpen(false); }}
                style={{
                  display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: isSel ? 'rgba(59,130,246,0.08)' : 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'none'; }}
              >
                {/* Left accent bar */}
                <div style={{ width: 56, flexShrink: 0, background: `linear-gradient(150deg,${color},${color}99)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={20} color="rgba(255,255,255,0.9)"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: color }}>{v.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {v.discount_type === 'percent'
                      ? `Giảm ${v.discount_value}%${v.max_discount ? ` (tối đa ${fmt(v.max_discount)})` : ''}`
                      : `Giảm ${fmt(v.discount_value)}`}
                    {v.min_order > 0 && ` · Đơn từ ${fmt(v.min_order)}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
                    HSD: {new Date(v.expires_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {isSel
                    ? <CheckCircle2 size={18} color="var(--emerald)"/>
                    : <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderRadius: '50%' }}/>
                  }
                </div>
              </div>
            );
          })}
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

  const [productVoucher,  setProductVoucher]  = useState(null); // Voucher giảm SP
  const [shippingVoucher, setShippingVoucher] = useState(null); // Voucher giảm ship
  const [promoCode,       setPromoCode]       = useState('');   // Mã sự kiện
  const [promoVoucher,    setPromoVoucher]    = useState(null); // Kết quả validate promo
  const [promoLoading,    setPromoLoading]    = useState(false);
  const [pointsToUse,     setPointsToUse]     = useState(0);
  const [loading,         setLoading]         = useState(false);
  const [shippingFee,     setShippingFee]     = useState(0); // tính sau khi load giỏ

  // Address state
  const [savedAddresses,  setSavedAddresses]  = useState([]);
  const [selectedAddrId,  setSelectedAddrId]  = useState(null);
  const [showAddrDrop,    setShowAddrDrop]    = useState(false);
  const [showNewAddrForm, setShowNewAddrForm] = useState(false);
  const [newAddrStr,      setNewAddrStr]      = useState('');
  const addrDropRef = useRef(null);

  // Load saved addresses
  useEffect(() => {
    addressApi.getAll().then(r => {
      const addrs = r.data.data || [];
      setSavedAddresses(addrs);
      const def = addrs.find(a => a.is_default) || addrs[0];
      if (def) {
        setSelectedAddrId(def.id);
        setForm(f => ({ ...f, shipping_address: def.address }));
      }
    }).catch(() => {});
  }, []);

  // Close address dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (addrDropRef.current && !addrDropRef.current.contains(e.target)) setShowAddrDrop(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectSavedAddr = (addr) => {
    setSelectedAddrId(addr.id);
    setShowNewAddrForm(false);
    setForm(f => ({ ...f, shipping_address: addr.address })); // chỉ điền địa chỉ
    setShowAddrDrop(false);
  };

  const selectNewAddr = () => {
    setSelectedAddrId(null);
    setShowNewAddrForm(true);
    setNewAddrStr('');
    setForm(f => ({ ...f, shipping_address: '' }));
    setShowAddrDrop(false);
  };

  const ADDR_ICON = { home: <Home size={14}/>, work: <Briefcase size={14}/>, other: <Map size={14}/> };

  // Phí ship từ giỏ hàng (mỗi SP 30k mặc định)
  useEffect(() => {
    const fee = (cart.items || []).reduce((s, i) => s + (parseFloat(i.ship_fee || 30000)), 0);
    setShippingFee(fee);
  }, [cart.items]);

  // Validate promo code
  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    if (productVoucher) { toast.error('Bạn đã chọn voucher sản phẩm rồi!'); return; }
    setPromoLoading(true);
    try {
      const res = await voucherApi.validatePromo(promoCode.trim().toUpperCase(), finalTotal);
      setPromoVoucher(res.data.data);
      toast.success('Mã hợp lệ!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mã không hợp lệ');
      setPromoVoucher(null);
    } finally { setPromoLoading(false); }
  };

  // Tính toán
  const effectiveProductVoucher = productVoucher || promoVoucher;
  const productDiscount  = effectiveProductVoucher?.discount_amount || 0;
  const shipDiscount     = shippingVoucher?.discount_amount || 0;
  const netShipping      = Math.max(0, shippingFee - shipDiscount);
  const maxPoints        = Math.min(user?.loyalty_points || 0, Math.floor((finalTotal - productDiscount) / 1000));
  const pointsDiscount   = pointsToUse * 1000;
  const grandTotal       = Math.max(0, finalTotal - productDiscount - pointsDiscount + netShipping);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiver_name || !form.receiver_phone || !form.shipping_address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng!'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        product_voucher_id:  effectiveProductVoucher?.voucher_id || null,
        shipping_voucher_id: shippingVoucher?.id || null,
        loyalty_points_used: pointsToUse,
      };
      const res = await orderApi.create(payload);
      clearCart?.();
      toast.success(`Đặt hàng thành công! Mã đơn: ${res.data.data.order_code} 🎉`);
      navigate(`/orders/${res.data.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại!');
    } finally { setLoading(false); }
  };

  useEffect(() => { setPointsToUse(0); }, [productVoucher, shippingVoucher, promoVoucher]);

  return (
    <div className="section"><div className="container">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 28 }}>📦 Thanh toán</h1>
      <form onSubmit={handleSubmit}>
        <div className="cart-layout">
          {/* ── LEFT: FORM ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Shipping Info */}
            <div className="card card--dropdown"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Thông tin giao hàng</h3>

              {/* Tên + SĐT riêng biệt */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Họ tên người nhận *</label>
                  <input className="form-control" required placeholder="Nguyễn Văn A"
                    value={form.receiver_name}
                    onChange={e => setForm({ ...form, receiver_name: e.target.value })} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Số điện thoại *</label>
                  <input className="form-control" required placeholder="09xxxxxxxx"
                    value={form.receiver_phone}
                    onChange={e => setForm({ ...form, receiver_phone: e.target.value })} />
                </div>
              </div>

              {/* Address Picker — chỉ chọn địa chỉ */}
              <div className="form-group" ref={addrDropRef} style={{ position: 'relative' }}>
                <label className="form-label">Địa chỉ giao hàng *</label>
                <div
                  onClick={() => setShowAddrDrop(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-2)', cursor: 'pointer', transition: 'border-color 0.15s',
                    minHeight: 44,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = showAddrDrop ? 'var(--accent)' : 'var(--border)'}
                >
                  <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {selectedAddrId ? (() => {
                      const a = savedAddresses.find(x => x.id === selectedAddrId);
                      return a ? (
                        <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{a.address}</span>
                      ) : <span style={{ color: 'var(--text-muted)' }}>Chọn địa chỉ...</span>;
                    })() : showNewAddrForm ? (
                      <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem' }}>+ Địa chỉ mới</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Chọn địa chỉ giao hàng...</span>
                    )}
                  </div>
                  {showAddrDrop ? <ChevronUp size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </div>

                {/* Dropdown */}
                {showAddrDrop && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999,
                      background: 'var(--surface-1)', border: '1.5px solid var(--accent)',
                      borderRadius: 'var(--radius-md)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    }}>
                    {savedAddresses.map(a => (
                      <div
                        key={a.id}
                        onClick={() => selectSavedAddr(a)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
                          cursor: 'pointer', borderBottom: '1px solid var(--border)',
                          background: selectedAddrId === a.id ? 'var(--accent-light)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (selectedAddrId !== a.id) e.currentTarget.style.background = 'var(--surface-2)'; }}
                        onMouseLeave={e => { if (selectedAddrId !== a.id) e.currentTarget.style.background = 'none'; }}
                      >
                        <div style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}>{ADDR_ICON[a.label] || <MapPin size={14}/>}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            {a.ten_nhan || a.label || 'Địa chỉ'}
                            {a.is_default && <span style={{ fontSize: '0.68rem', background: 'var(--accent)', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>Mặc định</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.address}</div>
                        </div>
                        {selectedAddrId === a.id && <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0 }} />}
                      </div>
                    ))}
                    {/* Thêm địa chỉ mới */}
                    <div
                      onClick={selectNewAddr}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                        cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem',
                        background: !selectedAddrId && showNewAddrForm ? 'var(--accent-light)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = !selectedAddrId && showNewAddrForm ? 'var(--accent-light)' : 'none'}
                    >
                      <Plus size={16} /> Giao đến địa chỉ khác
                    </div>
                  </div>
                )}
              </div>

              {/* New address form — chỉ nhập địa chỉ */}
              {showNewAddrForm && (
                <div style={{ marginTop: 12, padding: 14, background: 'var(--surface-3)', borderRadius: 'var(--radius-md)' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>?́ia chỉ giao hàng</label>
                  <input className="form-control" placeholder="Số nhà, đường, phường/xã, Q/H, tỉnh/TP"
                    value={newAddrStr}
                    onChange={e => { setNewAddrStr(e.target.value); setForm(f => ({ ...f, shipping_address: e.target.value })); }} />
                </div>
              )}

              {/* Note */}
              <div className="form-group" style={{ marginTop: 12 }}>
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

            {/* Voucher vận chuyển */}
            <div className="card card--dropdown"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag size={18}/> Voucher vận chuyển
              </h3>
              <MineVoucherPicker type="shipping" cartTotal={shippingFee} selected={shippingVoucher} onSelect={setShippingVoucher} placeholder="Chọn voucher giảm phí ship..." />
              {shippingVoucher && (
                <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'var(--radius-md)', fontSize:'0.84rem' }}>
                  ✅ {shippingVoucher.name} — Giảm {fmt(shippingVoucher.discount_amount)}
                </div>
              )}
            </div></div>

            {/* Voucher sản phẩm */}
            <div className="card card--dropdown"><div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag size={18}/> Voucher sản phẩm
              </h3>
              <MineVoucherPicker type="product" cartTotal={finalTotal} selected={productVoucher}
                onSelect={v => { setProductVoucher(v); setPromoVoucher(null); setPromoCode(''); }}
                placeholder="Chọn voucher giảm tiền sản phẩm..." />
              {productVoucher && (
                <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'var(--radius-md)', fontSize:'0.84rem' }}>
                  ✅ {productVoucher.name} — Giảm {fmt(productVoucher.discount_amount)}
                </div>
              )}
              {/* Promo Code — chỉ khi chưa chọn voucher SP */}
              {!productVoucher && (
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:6 }}>Hoặc nhập mã sự kiện (offline / online):</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <input className="form-control" placeholder="Nhập mã giảm giá sự kiện..."
                      value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoVoucher(null); }}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleValidatePromo())}
                      style={{ flex:1 }} />
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleValidatePromo} disabled={promoLoading}>
                      {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {promoVoucher && (
                    <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'var(--radius-md)', fontSize:'0.84rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span>✅ {promoVoucher.name} — Giảm {fmt(promoVoucher.discount_amount)}</span>
                      <button type="button" onClick={() => { setPromoVoucher(null); setPromoCode(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)' }}><X size={14}/></button>
                    </div>
                  )}
                </div>
              )}
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
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span style={{ color: shippingFee === 0 ? 'var(--emerald)' : 'inherit' }}>
                {shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee)}
              </span>
            </div>
            {shipDiscount > 0 && (
              <div className="summary-row discount">
                <span>Giảm phí ship ({shippingVoucher?.name})</span>
                <span>-{fmt(shipDiscount)}</span>
              </div>
            )}
            {productDiscount > 0 && (
              <div className="summary-row discount">
                <span>Giảm giá SP ({effectiveProductVoucher?.name})</span>
                <span>-{fmt(productDiscount)}</span>
              </div>
            )}
            {pointsToUse > 0 && (
              <div className="summary-row" style={{ color: 'var(--amber)' }}>
                <span>⭐ Điểm tích lũy ({pointsToUse} điểm)</span>
                <span>-{fmt(pointsDiscount)}</span>
              </div>
            )}
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
