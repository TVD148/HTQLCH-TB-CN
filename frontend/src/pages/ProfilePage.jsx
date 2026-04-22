import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Package, MapPin, Star, Lock, LogOut, Ticket,
  ChevronRight, Plus, Trash2, CheckCircle2, Edit2,
  Navigation, Search, X, XCircle, Home, Briefcase, Map,
  ChevronDown, ChevronUp, Copy, Clock
} from 'lucide-react';
import { authApi, orderApi, addressApi, voucherApi, reviewApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtCur  = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const STATUS_MAP = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: '#F59E0B' },
  da_xac_nhan:  { label: 'Đã xác nhận',  color: '#3B82F6' },
  dang_giao:    { label: 'Đang giao',     color: '#8B5CF6' },
  da_giao:      { label: 'Đã giao',       color: '#10B981' },
  da_huy:       { label: 'Đã huỷ',        color: '#EF4444' },
  hoan_tien:    { label: 'Hoàn tiền',     color: '#6B7280' },
};

// ─── SIDEBAR ────────────────────────────────────────────────────
function Sidebar({ user, tab, setTab, onLogout }) {
  const initials = user?.name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || '?';
  const menu = [
    { key: 'info',     icon: <User size={16}/>,     label: 'Thông tin tài khoản' },
    { key: 'orders',   icon: <Package size={16}/>,   label: 'Lịch sử đơn hàng' },
    { key: 'vouchers', icon: <Ticket size={16}/>,    label: 'Voucher của tôi' },
    { key: 'address',  icon: <MapPin size={16}/>,    label: 'Địa chỉ đã lưu' },
    { key: 'reviews',  icon: <Star size={16}/>,      label: 'Đánh giá đơn hàng' },
    { key: 'password', icon: <Lock size={16}/>,      label: 'Đổi mật khẩu' },
  ];
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', alignSelf: 'flex-start' }}>
      {/* User card */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
        </div>
      </div>

      {/* Menu */}
      {menu.map(m => (
        <button key={m.key} onClick={() => setTab(m.key)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 18px', background: tab === m.key ? 'var(--accent-light)' : 'none',
            border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
            color: tab === m.key ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: tab === m.key ? 700 : 500, fontSize: '0.875rem', transition: 'all 0.15s',
            textAlign: 'left',
          }}
          onMouseEnter={e => { if (tab !== m.key) e.currentTarget.style.background = 'var(--surface-3)'; }}
          onMouseLeave={e => { if (tab !== m.key) e.currentTarget.style.background = 'none'; }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{m.icon} {m.label}</span>
          <ChevronRight size={14} />
        </button>
      ))}

      {/* Logout */}
      <button onClick={onLogout}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: '0.875rem', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#ef444415'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <LogOut size={16} /> Đăng xuất
      </button>
    </div>
  );
}

// ─── PANEL: THÔNG TIN TÀI KHOẢN ────────────────────────────────
function InfoPanel({ user, updateUser }) {
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'' });
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await authApi.updateProfile(form);
      updateUser(res.data.data);
      toast.success('Cập nhật thành công!');
    } catch { toast.error('Có lỗi xảy ra!'); }
    finally { setLoading(false); }
  };

  const rows = [
    { label: 'Họ và tên', field: 'name', type: 'text', icon: <User size={14}/> },
    { label: 'Số điện thoại', field: 'phone', type: 'tel', icon: null },
  ];

  return (
    <div>
      <h2 style={hdr}>Thông tin cá nhân</h2>
      <form onSubmit={save}>
        {rows.map(r => (
          <div key={r.field} style={rowStyle}>
            <label style={labelStyle}>{r.label}</label>
            <input className="form-control" type={r.type} value={form[r.field]}
              onChange={e => setForm({...form, [r.field]: e.target.value})}
              style={{ maxWidth: 360 }} />
          </div>
        ))}
        <div style={rowStyle}>
          <label style={labelStyle}>Email</label>
          <input className="form-control" value={user?.email||''} disabled style={{ maxWidth: 360, opacity: 0.6 }} />
        </div>
        <div style={{ marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: 140 }} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── MODAL ĐÁNH GIÁ SẢN PHẨM ───────────────────────────────────
function ReviewModal({ item, onClose, onReviewed }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await reviewApi.create({
        product_id: item.product_id,
        order_item_id: item.id,
        rating,
        comment
      });
      toast.success('Đánh giá thành công! Cảm ơn bạn.');
      onReviewed();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--surface-1)', borderRadius:12, width:'100%', maxWidth:400, padding:24 }}>
        <h3 style={{ marginTop:0, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Đánh giá sản phẩm
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={18}/></button>
        </h3>
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          <img src={item.product_thumbnail} alt={item.product_name} style={{ width:60, height:60, objectFit:'cover', borderRadius:8 }} />
          <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{item.product_name}</div>
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20 }}>
          {[1,2,3,4,5].map(star => (
            <Star key={star} size={32} cursor="pointer"
              fill={star <= rating ? '#F59E0B' : 'transparent'}
              color={star <= rating ? '#F59E0B' : 'var(--border)'}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea className="form-control" rows={4} placeholder="Nhận xét của bạn về sản phẩm này..."
          value={comment} onChange={e=>setComment(e.target.value)} style={{ marginBottom:20 }} />

        <button onClick={submit} className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </div>
  );
}

// ─── ORDER CARD MỞ RỘNG ─────────────────────────────────────────
function OrderCard({ o, onOrderUpdated, existingReviews }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reordering, setReordering] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const toggleExpand = async () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      if (!details) {
        setLoading(true);
        try {
          const res = await orderApi.getById(o.id);
          setDetails(res.data.data);
        } catch (e) {} finally { setLoading(false); }
      }
    }
  };

  const handleReorder = async (e) => {
    e.stopPropagation();
    if (!details?.items?.length) return;
    setReordering(true);
    try {
      for (const item of details.items) {
        await addToCart(item.product_id, item.quantity);
      }
      navigate('/cart');
    } catch { alert('Không thể thêm vào giỏ hàng!'); }
    finally { setReordering(false); }
  };

  const st = STATUS_MAP[o.status || o.trang_thai] || { label: o.status || o.trang_thai, color: '#999' };

  return (
    <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:10, marginBottom:12, overflow:'hidden' }}>
      <div onClick={toggleExpand} style={{ padding:'14px 18px', cursor:'pointer', display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span
            onClick={(e) => { e.stopPropagation(); navigate(`/orders/${o.order_code}`); }}
            style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--accent)', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}
            title="Xem chi tiết đơn hàng"
          >#{o.order_code}</span>
          <span style={{ fontSize:'0.78rem', fontWeight:700, color:st.color, background:st.color+'18', padding:'3px 10px', borderRadius:20 }}>{st.label}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.8rem', color:'var(--text-muted)' }}>
          <span>{fmtDate(o.created_at)}</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}>
            {o.item_count||1} sản phẩm
            {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </span>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <span style={{ fontWeight:700, color:'var(--accent)' }}>{fmtCur(o.total_amount)}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding:'0 18px 18px 18px', borderTop:'1px solid var(--border)' }}>
          {loading ? <div style={{ padding:10, textAlign:'center', color:'var(--text-muted)' }}>Đang tải chi tiết...</div> : details?.items ? (
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:12 }}>
              {details.items.map(item => {
                const reviewed = existingReviews?.find(r => r.order_item_id === item.id);
                return (
                  <div key={item.id} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <img src={item.product_thumbnail} alt={item.product_name} style={{ width:50, height:50, objectFit:'cover', borderRadius:6, border:'1px solid var(--border)' }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{item.product_name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>x{item.quantity} — {fmtCur(item.unit_price)}</div>
                    </div>
                    {o.status === 'da_giao' && (
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                        {reviewed ? (
                          <div style={{ display:'flex', alignItems:'center', gap:2, color:'#F59E0B', fontSize:'0.8rem', fontWeight:700 }}>
                            {reviewed.rating} <Star size={12} fill="#F59E0B"/>
                          </div>
                        ) : (
                          <button onClick={(e)=>{ e.stopPropagation(); setReviewModalItem(item); }} className="btn btn-sm" style={{ padding:'4px 10px', fontSize:'0.75rem', background:'var(--surface-3)', border:'1px solid var(--border)', color:'var(--text-primary)' }}>
                            Đánh giá
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : <div style={{ padding:10, textAlign:'center', color:'var(--text-muted)' }}>Lỗi tải chi tiết</div>}

          {/* Action buttons */}
          <div style={{ marginTop:14, display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/orders/${o.order_code}`); }}
              className="btn btn-ghost btn-sm"
              style={{ padding:'7px 14px', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:5 }}
            >
              📄 Xem chi tiết
            </button>
            {o.status === 'da_giao' && details?.items?.length > 0 && (
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="btn btn-primary btn-sm"
                style={{ padding:'7px 18px', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:6 }}
              >
                {reordering ? 'Đang thêm...' : '🔄 Mua lại'}
              </button>
            )}
          </div>
        </div>
      )}

      {reviewModalItem && (
        <ReviewModal
          item={reviewModalItem}
          onClose={()=>setReviewModalItem(null)}
          onReviewed={onOrderUpdated}
        />
      )}
    </div>
  );
}

// ─── PANEL: LỊCH SỬ ĐƠN HÀNG ───────────────────────────────────
function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [existingReviews, setExistingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordRes, revRes] = await Promise.all([
        orderApi.getAll(),
        reviewApi.getMine().catch(()=>({data:{data:[]}}))
      ]);
      setOrders(ordRes.data.data || []);
      setExistingReviews(revRes.data.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const statuses = ['all', 'cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy'];
  const filtered = orders.filter(o => {
    const matchStatus = statusTab === 'all' || o.status === statusTab;
    const matchSearch = !search.trim() || o.order_code?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <h2 style={hdr}>Lịch sử đơn hàng</h2>
      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px', marginBottom:16 }}>
        <Search size={14} color="var(--text-muted)" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm theo mã đơn hàng..."
          style={{ background:'none', border:'none', outline:'none', flex:1, fontSize:'0.875rem', color:'var(--text-primary)' }} />
      </div>
      {/* Tabs */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', borderBottom:'1.5px solid var(--border)', marginBottom:20 }}>
        {statuses.map(s => (
          <button key={s} onClick={()=>setStatusTab(s)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:'8px 14px', fontSize:'0.8rem', fontWeight: statusTab===s?700:500, color: statusTab===s?'var(--accent)':'var(--text-muted)', borderBottom: statusTab===s?'2px solid var(--accent)':'2px solid transparent', marginBottom:-1.5, transition:'all 0.15s' }}>
            {s==='all'?'Tất cả':(STATUS_MAP[s]?.label||s)}
          </button>
        ))}
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner"/></div>
        : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
            <Package size={48} strokeWidth={1.2} style={{ marginBottom:14, opacity:0.4 }} />
            <div>Bạn chưa có đơn hàng nào</div>
          </div>
        ) : filtered.map(o => (
          <OrderCard key={o.id} o={o} existingReviews={existingReviews} onOrderUpdated={loadData} />
        ))}
    </div>
  );
}

// ─── PANEL: VOUCHER CỦA TÔI ─────────────────────────────────────
const TYPE_COLOR = { percent: '#3B82F6', fixed_amount: '#10B981', freeship: '#F59E0B' };
const TYPE_LABEL = { percent: '% Giảm', fixed_amount: 'Giảm tiền', freeship: '🚚 Miễn ship' };

function VoucherCard({ v }) {
  const expired = v.expires_at && new Date(v.expires_at) < new Date();
  const accent  = TYPE_COLOR[v.discount_type] || '#3B82F6';

  const getDiscountLabel = () => {
    if (v.discount_type === 'percent')      return `Giảm ${v.discount_value}%${v.max_discount ? ` (tối đa ${fmtCur(v.max_discount)})` : ''}`;
    if (v.discount_type === 'fixed_amount') return `Giảm ${fmtCur(v.discount_value)}`;
    if (v.discount_type === 'freeship')     return 'Miễn phí vận chuyển';
    return '';
  };

  return (
    <div style={{
      display: 'flex', borderRadius: 12, overflow: 'hidden',
      border: `1.5px solid ${v.used || expired ? 'var(--border)' : accent + '44'}`,
      background: 'var(--surface-2)', opacity: v.used || expired ? 0.6 : 1, transition: 'box-shadow 0.2s',
      marginBottom: 12
    }}
      onMouseEnter={e => { if (!v.used && !expired) e.currentTarget.style.boxShadow = `0 4px 20px ${accent}28`; }}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{
        width: 72, flexShrink: 0, background: `linear-gradient(160deg, ${accent}, ${accent}BB)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
      }}>
        <Ticket size={22} color="rgba(255,255,255,0.9)" />
        <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)', fontWeight: 800, textAlign: 'center' }}>
          {TYPE_LABEL[v.discount_type]}
        </span>
      </div>
      <div style={{ width: 1, borderLeft: `2px dashed ${accent}44`, margin: '10px 0', flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '14px 16px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: accent, marginBottom: 3 }}>{getDiscountLabel()}</div>
        {v.min_order > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Đơn tối thiểu: {fmtCur(v.min_order)}</div>}
        <div style={{ fontSize: '0.72rem', color: expired ? 'var(--red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Clock size={11} /> HSD: {v.expires_at ? new Date(v.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}
        </div>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
        {v.used ? <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={13} /> Đã dùng</span>
        : expired ? <span style={{ fontSize: '0.72rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={13} /> Hết hạn</span>
        : <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={13} /> Có thể dùng</span>}
      </div>
    </div>
  );
}

function VouchersPanel() {
  const [vouchers, setVouchers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('available'); // 'available' | 'used'

  useEffect(() => {
    voucherApi.getMine()
      .then(r => setVouchers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const available = vouchers.filter(v => !v.used && (!v.expires_at || new Date(v.expires_at) >= new Date()));
  const used      = vouchers.filter(v => v.used || (v.expires_at && new Date(v.expires_at) < new Date()));
  const current = tab === 'available' ? available : used;

  return (
    <div>
      <h2 style={hdr}>Voucher của tôi</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1.5px solid var(--border)', paddingBottom: 0 }}>
        {[
          { key: 'available', label: `Có thể dùng (${available.length})` },
          { key: 'used',      label: `Đã dùng / Hết hạn (${used.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: '0.88rem', fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)', borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1.5, transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : current.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <Ticket size={48} strokeWidth={1.2} style={{ marginBottom: 14, opacity: 0.4 }} />
          <div>Chưa có voucher nào</div>
        </div>
      ) : current.map(v => <VoucherCard key={v.id} v={v} />)}
    </div>
  );
}

// ─── NOMINATIM SEARCH ───────────────────────────────────────────
function NominatimSearch({ onSelect }) {
  const [q, setQ]           = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const search = useCallback((val) => {
    if (!val.trim() || val.length < 3) { setResults([]); return; }
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=vn&format=json&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        const data = await r.json();
        setResults(data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 500);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px' }}>
        <Search size={14} color="var(--text-muted)" />
        <input value={q} onChange={e=>{ setQ(e.target.value); search(e.target.value); }}
          placeholder="Tìm địa chỉ... (vd: 123 Lê Lợi, Q1, TP.HCM)"
          style={{ background:'none', border:'none', outline:'none', flex:1, fontSize:'0.875rem', color:'var(--text-primary)' }} />
        {loading && <div style={{ width:14,height:14,border:'2px solid var(--accent)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />}
      </div>
      {results.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:100, background:'var(--surface-1)', border:'1px solid var(--border)', borderRadius:8, marginTop:4, boxShadow:'0 8px 24px rgba(0,0,0,0.25)', maxHeight:220, overflowY:'auto' }}>
          {results.map((r, i) => (
            <button key={i} onClick={() => { onSelect(r); setQ(r.display_name); setResults([]); }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', background:'none', border:'none', borderBottom:'1px solid var(--border)', cursor:'pointer', fontSize:'0.82rem', color:'var(--text-secondary)', transition:'background 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-3)'}
              onMouseLeave={e=>e.currentTarget.style.background='none'}
            >
              <span style={{ color:'var(--accent)', marginRight:6 }}>📍</span>
              {r.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAP IFRAME (OpenStreetMap) ──────────────────────────────────
function MapPreview({ lat, lng }) {
  if (!lat || !lng) return null;
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.004},${lng+0.005},${lat+0.004}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--border)', marginTop:12, height:200 }}>
      <iframe src={url} style={{ width:'100%', height:'100%', border:'none' }} title="Bản đồ địa chỉ" />
    </div>
  );
}

// ─── ADDRESS MODAL ───────────────────────────────────────────────
function AddressModal({ initial, onClose, onSaved }) {
  const LABELS = ['Nhà', 'Cơ quan', 'Khác'];
  const [form, setForm] = useState({
    label: initial?.label || 'Nhà',
    address: initial?.address || '',
    city: initial?.city || '',
    district: initial?.district || '',
    lat: initial?.lat || null,
    lng: initial?.lng || null,
    is_default: initial?.is_default || false,
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNominatimSelect = (r) => {
    setForm(f => ({
      ...f,
      address: r.display_name,
      city:    r.address?.city || r.address?.town || r.address?.state || '',
      district:r.address?.county || r.address?.suburb || '',
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Trình duyệt không hỗ trợ định vị!'); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`);
        const data = await r.json();
        setForm(f => ({
          ...f,
          address: data.display_name || `${lat}, ${lng}`,
          city:    data.address?.city || data.address?.town || data.address?.state || '',
          district:data.address?.county || data.address?.suburb || '',
          lat, lng,
        }));
        toast.success('Đã xác định vị trí hiện tại!');
      } catch { toast.error('Không thể lấy địa chỉ từ vị trí!'); }
      finally { setGeoLoading(false); }
    }, () => { toast.error('Không thể truy cập vị trí!'); setGeoLoading(false); });
  };

  const handleSave = async () => {
    if (!form.address.trim()) { toast.error('Vui lòng nhập địa chỉ!'); return; }
    setSaving(true);
    try {
      if (initial?.id) {
        await addressApi.update(initial.id, form);
        toast.success('Đã cập nhật địa chỉ!');
      } else {
        await addressApi.create(form);
        toast.success('Đã thêm địa chỉ!');
      }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi lưu địa chỉ!'); }
    finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--surface-1)', borderRadius:14, width:'100%', maxWidth:520, boxShadow:'0 24px 60px rgba(0,0,0,0.4)', maxHeight:'90vh', overflowY:'auto' }}>
        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontWeight:800, fontSize:'1.05rem', margin:0 }}>
            <MapPin size={18} style={{ marginRight:8, verticalAlign:'middle', color:'var(--accent)' }} />
            {initial?.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={18}/></button>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:16 }}>
          {/* Label */}
          <div>
            <label style={labelStyle}>Nhãn địa chỉ</label>
            <div style={{ display:'flex', gap:8, marginTop:6 }}>
              {LABELS.map(l => (
                <button key={l} onClick={()=>setForm(f=>({...f,label:l}))}
                  style={{ padding:'6px 16px', borderRadius:20, border:`1.5px solid ${form.label===l?'var(--accent)':'var(--border)'}`, background:form.label===l?'var(--accent-light)':'none', color:form.label===l?'var(--accent)':'var(--text-muted)', fontWeight:form.label===l?700:500, cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:5 }}>
                  {l==='Nhà'?<Home size={12}/>:l==='Cơ quan'?<Briefcase size={12}/>:<Map size={12}/>} {l}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div>
            <label style={labelStyle}>Tìm địa chỉ trên bản đồ</label>
            <div style={{ marginTop:6 }}>
              <NominatimSearch onSelect={handleNominatimSelect} />
            </div>
          </div>

          {/* Geolocation button */}
          <button onClick={useCurrentLocation} disabled={geoLoading}
            style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1.5px dashed var(--accent)', color:'var(--accent)', borderRadius:8, padding:'10px 14px', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--accent-light)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}
          >
            <Navigation size={15}/> {geoLoading ? 'Đang xác định vị trí...' : 'Dùng vị trí hiện tại của tôi'}
          </button>

          {/* Address text */}
          <div>
            <label style={labelStyle}>Địa chỉ cụ thể</label>
            <textarea className="form-control" rows={2} value={form.address}
              onChange={e=>setForm(f=>({...f,address:e.target.value}))}
              placeholder="Số nhà, tên đường, phường/xã..."
              style={{ marginTop:6, resize:'vertical' }} />
          </div>

          {/* Map preview */}
          <MapPreview lat={form.lat} lng={form.lng} />

          {/* Default checkbox */}
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:'0.875rem' }}>
            <input type="checkbox" checked={form.is_default} onChange={e=>setForm(f=>({...f,is_default:e.target.checked}))} />
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Huỷ</button>
          <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving} style={{ minWidth:100 }}>
            {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PANEL: ĐỊA CHỈ ─────────────────────────────────────────────
function AddressPanel() {
  const [addresses, setAddresses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null); // null | 'new' | { address obj }

  const load = () => {
    setLoading(true);
    addressApi.getAll().then(r => setAddresses(r.data.data || [])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá địa chỉ này?')) return;
    await addressApi.remove(id);
    toast.success('Đã xoá!');
    load();
  };

  const handleDefault = async (id) => {
    await addressApi.setDefault(id);
    toast.success('Đã đặt mặc định!');
    load();
  };

  return (
    <div>
      <h2 style={hdr}>Địa chỉ đã lưu</h2>

      {loading ? <div className="spinner-wrap"><div className="spinner"/></div>
        : addresses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 24px', background:'var(--surface-2)', borderRadius:12, border:'1px solid var(--border)', marginBottom:16 }}>
            <MapPin size={48} strokeWidth={1.2} style={{ opacity:0.3, marginBottom:12 }} />
            <div style={{ color:'var(--text-muted)', marginBottom:4 }}>Không có địa chỉ</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
            {addresses.map(a => (
              <div key={a.id} style={{ background:'var(--surface-2)', border:`1.5px solid ${a.is_default?'var(--accent)':'var(--border)'}`, borderRadius:10, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--surface-3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {a.label==='Nhà'?<Home size={16}/>:a.label==='Cơ quan'?<Briefcase size={16}/>:<Map size={16}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontWeight:700, fontSize:'0.9rem' }}>{a.label}</span>
                    {a.is_default && (
                      <span style={{ fontSize:'0.7rem', fontWeight:700, background:'var(--accent)', color:'#fff', padding:'2px 8px', borderRadius:20 }}>Mặc định</span>
                    )}
                  </div>
                  <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{a.address}</div>
                  {a.lat && a.lng && (
                    <a href={`https://www.openstreetmap.org/?mlat=${a.lat}&mlon=${a.lng}#map=16/${a.lat}/${a.lng}`}
                      target="_blank" rel="noreferrer"
                      style={{ fontSize:'0.75rem', color:'var(--accent)', display:'inline-flex', alignItems:'center', gap:4, marginTop:4 }}>
                      <Map size={11}/> Xem trên bản đồ
                    </a>
                  )}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                  {!a.is_default && (
                    <button onClick={()=>handleDefault(a.id)} title="Đặt mặc định"
                      style={{ background:'none', border:'1px solid var(--border)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.75rem', transition:'all 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-muted)';}}
                    ><CheckCircle2 size={13}/></button>
                  )}
                  <button onClick={()=>setModal(a)} title="Sửa"
                    style={{ background:'none', border:'1px solid var(--border)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'var(--text-muted)', transition:'all 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
                  ><Edit2 size={13}/></button>
                  <button onClick={()=>handleDelete(a.id)} title="Xóa"
                    style={{ background:'none', border:'1px solid var(--border)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'var(--red)', transition:'all 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--red)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
                  ><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

      <button onClick={()=>setModal('new')} className="btn btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <Plus size={16}/> Thêm địa chỉ
      </button>

      {modal && (
        <AddressModal
          initial={modal === 'new' ? null : modal}
          onClose={()=>setModal(null)}
          onSaved={()=>{ setModal(null); load(); }}
        />
      )}
    </div>
  );
}

// ─── PANEL: ĐỔI MẬT KHẨU ────────────────────────────────────────
function PasswordPanel() {
  const [form, setForm] = useState({ current_password:'', new_password:'', confirm_password:'' });
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) { toast.error('Mật khẩu xác nhận không khớp!'); return; }
    if (form.new_password.length < 6) { toast.error('Mật khẩu phải từ 6 ký tự!'); return; }
    setLoading(true);
    try {
      await authApi.changePassword({ current_password: form.current_password, new_password: form.new_password });
      toast.success('Đổi mật khẩu thành công!');
      setForm({ current_password:'', new_password:'', confirm_password:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Mật khẩu hiện tại không đúng!'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={hdr}>Đổi mật khẩu</h2>
      <form onSubmit={save} style={{ maxWidth:400 }}>
        {[
          { field:'current_password', label:'Mật khẩu hiện tại' },
          { field:'new_password',     label:'Mật khẩu mới' },
          { field:'confirm_password', label:'Xác nhận mật khẩu mới' },
        ].map(r=>(
          <div key={r.field} className="form-group">
            <label className="form-label">{r.label}</label>
            <input className="form-control" type="password" value={form[r.field]} onChange={e=>setForm({...form,[r.field]:e.target.value})} />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop:8 }}>
          {loading?'Đang lưu...':'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}

// ─── PANEL: ĐÁNH GIÁ ────────────────────────────────────────────
function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewApi.getMine()
      .then(r => setReviews(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={hdr}>Đánh giá đơn hàng</h2>
      {loading ? <div className="spinner-wrap"><div className="spinner"/></div>
      : reviews.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <Star size={48} strokeWidth={1.2} style={{ opacity:0.3, marginBottom:12 }} />
          <div>Bạn chưa có đánh giá nào</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px' }}>
              <div style={{ display:'flex', gap:12, marginBottom:12, borderBottom:'1px solid var(--border)', paddingBottom:12 }}>
                <img src={r.product_thumbnail} alt={r.product_name} style={{ width:48, height:48, objectFit:'cover', borderRadius:6, border:'1px solid var(--border)' }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:4 }}>{r.product_name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ display:'flex', gap:2 }}>
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={13} fill={star <= r.rating ? '#F59E0B' : 'transparent'} color={star <= r.rating ? '#F59E0B' : 'var(--border)'} />
                      ))}
                    </div>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{fmtDate(r.created_at)}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize:'0.9rem', color:'var(--text-primary)', lineHeight:1.6 }}>
                {r.comment || <span style={{ color:'var(--text-muted)', fontStyle:'italic' }}>Không có nhận xét</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────
const hdr      = { fontSize:'1.15rem', fontWeight:800, marginBottom:24, marginTop:0 };
const rowStyle = { display:'flex', alignItems:'center', gap:16, marginBottom:16, flexWrap:'wrap' };
const labelStyle = { fontSize:'0.85rem', fontWeight:600, color:'var(--text-muted)', minWidth:140, flexShrink:0 };

// ─── MAIN ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'info';

  const setTab = (newTab) => {
    navigate(`/profile?tab=${newTab}`);
  };

  useEffect(() => { document.title = 'Hồ sơ của tôi – TechStore'; }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const panels = {
    info:     <InfoPanel user={user} updateUser={updateUser} />,
    orders:   <OrdersPanel />,
    vouchers: <VouchersPanel />,
    address:  <AddressPanel />,
    reviews:  <ReviewsPanel />,
    password: <PasswordPanel />,
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'start', maxWidth:960 }}>
          <Sidebar user={user} tab={tabParam} setTab={setTab} onLogout={handleLogout} />
          <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:12, padding:'28px 32px' }}>
            {panels[tabParam] || panels.info}
          </div>
        </div>
      </div>
    </div>
  );
}
