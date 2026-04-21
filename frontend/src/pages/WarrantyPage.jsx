import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle, Clock, Send, Package, Truck,
  Calendar, Phone, AlertCircle, LogIn, ChevronRight,
  FileText, MapPin, X, RefreshCw, Info
} from 'lucide-react';
import { warrantyApi } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── Trạng thái ─────────────────────────────────────────── */
const STATUS_MAP = {
  cho_xu_ly:   { label: 'Chờ xử lý',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⏳' },
  dang_xu_ly:  { label: 'Đang xử lý',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: '🔧' },
  hoan_thanh:  { label: 'Hoàn thành',    color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '✅' },
  tu_choi:     { label: 'Từ chối',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '❌' },
  // legacy keys
  pending:     { label: 'Chờ xử lý',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⏳' },
  processing:  { label: 'Đang xử lý',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: '🔧' },
  resolved:    { label: 'Hoàn thành',    color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '✅' },
  rejected:    { label: 'Từ chối',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '❌' },
};

/* ── Hình thức bảo hành ─────────────────────────────────── */
const METHODS = [
  {
    key: 'buu_dien',
    label: 'Gửi bưu điện',
    icon: <Truck size={22} />,
    desc: 'Đóng gói sản phẩm và gửi qua bưu điện / dịch vụ vận chuyển đến địa chỉ cửa hàng. Chúng tôi sẽ hoàn trả sau khi sửa.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.35)',
  },
  {
    key: 'ship_ve',
    label: 'Ship về cửa hàng',
    icon: <Package size={22} />,
    desc: 'Chúng tôi sẽ cử nhân viên đến lấy hàng tận nơi, sau khi sửa xong sẽ ship trả về cho bạn. Miễn phí 2 chiều cho đơn trên 3 triệu.',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.35)',
  },
  {
    key: 'den_cua_hang',
    label: 'Hẹn đến cửa hàng',
    icon: <Calendar size={22} />,
    desc: 'Chọn ngày giờ thuận tiện để mang sản phẩm đến trực tiếp. Kỹ thuật viên sẽ kiểm tra và tư vấn ngay tại chỗ.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.35)',
  },
];

/* ── Hàm tính thời gian bảo hành còn lại ────────────────── */
function calcWarrantyLeft(orderDate, warrantyMonths) {
  const wm = warrantyMonths || 12;
  const end = new Date(orderDate);
  end.setMonth(end.getMonth() + wm);
  const diffMs = end - new Date();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return { end, diffDays, expired: diffDays <= 0 };
}

/* ══════════════════════════════════════════════════════════ */
export default function WarrantyPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  /* data */
  const [requests,  setRequests]  = useState([]);
  const [products,  setProducts]  = useState([]);  // eligible products
  const [pageLoading, setPageLoading] = useState(true);

  /* form state */
  const [showForm, setShowForm] = useState(false);
  const [step,     setStep]     = useState(1);   // 1=chọn sp, 2=chi tiết, 3=confirm
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    hinh_thuc:         '',
    issue_description: '',
    so_dien_thoai:     '',
    lich_hen:          '',
    so_serial:         '',
  });
  const [submitting, setSubmitting] = useState(false);

  /* ── Load data ─────────────────────────────────────────── */
  const load = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        warrantyApi.getAll(),
        warrantyApi.getEligibleProducts(),
      ]);
      setRequests(wRes.data.data  || []);
      setProducts(pRes.data.data  || []);
    } catch { /* ignore */ }
    finally { setPageLoading(false); }
  };

  useEffect(() => {
    document.title = 'Bảo hành – TechStore';
    if (user) load();
    else setPageLoading(false);
  }, [user]);

  /* ── Reset form ─────────────────────────────────────────── */
  const resetForm = () => {
    setStep(1);
    setSelectedProduct(null);
    setForm({ hinh_thuc: '', issue_description: '', so_dien_thoai: user?.phone || '', lich_hen: '', so_serial: '' });
    setShowForm(false);
  };

  /* ── Submit ─────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!selectedProduct || !form.hinh_thuc || !form.issue_description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!'); return;
    }
    if (form.hinh_thuc === 'den_cua_hang' && !form.lich_hen) {
      toast.error('Vui lòng chọn thời gian hẹn đến cửa hàng!'); return;
    }
    setSubmitting(true);
    try {
      await warrantyApi.create({
        order_item_id:     selectedProduct.order_item_id,
        issue_description: form.issue_description,
        hinh_thuc:         form.hinh_thuc,
        so_dien_thoai:     form.so_dien_thoai,
        lich_hen:          form.lich_hen || null,
        serial_number:     form.so_serial || null,
      });
      toast.success('🎉 Yêu cầu bảo hành đã được gửi thành công!');
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Min datetime cho lich_hen (ngày mai 8h) ─────────────── */
  const minDatetime = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  })();

  /* ════════════════════════════════════════════════════════ */
  /* LOADING SKELETON                                         */
  if (authLoading || pageLoading) {
    return (
      <div className="section"><div className="container" style={{ maxWidth: 860 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ height: 80, opacity: 0.5, animation: 'pulse 1.4s infinite' }} />
          ))}
        </div>
      </div></div>
    );
  }

  /* ════════════════════════════════════════════════════════ */
  /* GUEST — chưa đăng nhập                                  */
  if (!user) {
    return (
      <div className="section"><div className="container" style={{ maxWidth: 520 }}>
        <div style={{
          textAlign: 'center', padding: '64px 32px',
          background: 'var(--surface-2)', borderRadius: 24,
          border: '1px solid var(--border)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}>
            <Shield size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 10 }}>Trung tâm bảo hành</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
            Vui lòng <strong>đăng nhập</strong> để xem lịch sử bảo hành và tạo yêu cầu bảo hành mới cho sản phẩm của bạn.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary" style={{ gap: 8 }}>
              <LogIn size={16} /> Đăng nhập ngay
            </Link>
            <Link to="/register" className="btn btn-ghost">Tạo tài khoản</Link>
          </div>
          {/* Info banners */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 36, textAlign: 'left' }}>
            {[
              { icon: '🔒', t: 'Bảo hành chính hãng', d: '12–24 tháng' },
              { icon: '⏱️', t: 'Xử lý nhanh',          d: '7–14 ngày làm việc' },
              { icon: '📦', t: 'Free ship 2 chiều',     d: 'Đơn trên 3 triệu' },
            ].map(b => (
              <div key={b.t} style={{
                padding: '14px 12px', borderRadius: 12,
                background: 'var(--surface-3)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 2 }}>{b.t}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div></div>
    );
  }

  /* ════════════════════════════════════════════════════════ */
  /* ĐÃ ĐĂNG NHẬP                                            */
  return (
    <div className="section"><div className="container" style={{ maxWidth: 880 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Trung tâm bảo hành</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, marginTop: 2 }}>
              Quản lý yêu cầu bảo hành sản phẩm của bạn
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setStep(1); }}
          style={{ gap: 8 }}
          disabled={showForm}
        >
          <Shield size={15} /> + Tạo yêu cầu bảo hành
        </button>
      </div>

      {/* ── Info banners ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '🔒', title: 'Bảo hành chính hãng', desc: '12–24 tháng tùy sản phẩm. Đổi mới nếu lỗi nhà sản xuất trong 15 ngày.' },
          { icon: '⏱️', title: 'Thời gian xử lý',     desc: '7–14 ngày làm việc. Hoàn trả tận nhà sau khi sửa xong.' },
          { icon: '📦', title: 'Hỗ trợ Free ship',    desc: 'Miễn phí vận chuyển 2 chiều khi giá trị sản phẩm trên 3 triệu.' },
        ].map(b => (
          <div key={b.title} className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '18px 14px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 5, fontSize: '0.9rem' }}>{b.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          FORM TẠO YÊU CẦU BẢO HÀNH (multi-step)
         ══════════════════════════════════════════════════════ */}
      {showForm && (
        <div className="card" style={{ marginBottom: 28, border: '1.5px solid var(--accent)', borderRadius: 20, overflow: 'hidden' }}>
          {/* Step indicator */}
          <div style={{
            display: 'flex', background: 'var(--surface-3)',
            borderBottom: '1px solid var(--border)', padding: '0 28px',
          }}>
            {[
              { n: 1, label: 'Chọn sản phẩm' },
              { n: 2, label: 'Hình thức & mô tả' },
              { n: 3, label: 'Xác nhận' },
            ].map((s, i) => (
              <div key={s.n} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 0', marginRight: 28, cursor: step > s.n ? 'pointer' : 'default',
                opacity: step < s.n ? 0.45 : 1,
              }} onClick={() => step > s.n && setStep(s.n)}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', fontWeight: 700, fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s.n ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--border)',
                  color: step >= s.n ? '#fff' : 'var(--text-muted)',
                  boxShadow: step === s.n ? '0 2px 10px rgba(99,102,241,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>{step > s.n ? <CheckCircle size={14} /> : s.n}</div>
                <span style={{
                  fontSize: '0.83rem', fontWeight: step === s.n ? 700 : 500,
                  color: step === s.n ? 'var(--accent)' : 'var(--text-secondary)',
                }}>{s.label}</span>
                {i < 2 && <ChevronRight size={14} style={{ color: 'var(--border)', marginLeft: 8 }} />}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="card-body" style={{ padding: '28px 28px 24px' }}>

            {/* ── STEP 1: Chọn sản phẩm ───────────────────────── */}
            {step === 1 && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Chọn sản phẩm cần bảo hành</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                  Chỉ hiển thị sản phẩm bạn đã mua, đơn hàng đã giao và còn trong thời hạn bảo hành.
                </p>

                {products.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    background: 'var(--surface-3)', borderRadius: 16,
                    border: '1.5px dashed var(--border)',
                  }}>
                    <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Không có sản phẩm đủ điều kiện</div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
                      Bạn chưa có sản phẩm nào đã mua (đơn đã giao) và còn thời hạn bảo hành.
                    </div>
                    <Link to="/orders" className="btn btn-ghost btn-sm">Xem đơn hàng của tôi</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {products.map(p => {
                      const wl = calcWarrantyLeft(p.order_date, p.warranty_months);
                      const isSelected = selectedProduct?.order_item_id === p.order_item_id;
                      const daysLeft = wl.diffDays;
                      const urgentColor = daysLeft <= 30 ? '#ef4444' : daysLeft <= 90 ? '#f59e0b' : '#10b981';

                      return (
                        <div
                          key={p.order_item_id}
                          onClick={() => setSelectedProduct(p)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                            border: `1.5px solid ${isSelected ? '#6366f1' : 'var(--border)'}`,
                            background: isSelected ? 'rgba(99,102,241,0.06)' : 'var(--surface-2)',
                            transition: 'all 0.18s',
                            boxShadow: isSelected ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
                          }}
                        >
                          {/* Thumbnail */}
                          <div style={{
                            width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                            background: 'var(--surface-3)', border: '1px solid var(--border)',
                          }}>
                            {p.thumbnail
                              ? <img src={p.thumbnail} alt={p.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
                            }
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.product_name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Đơn #{p.order_code} · Mua {new Date(p.order_date).toLocaleDateString('vi-VN')}
                            </div>
                          </div>

                          {/* Warranty badge */}
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                              background: `${urgentColor}18`, color: urgentColor,
                              border: `1px solid ${urgentColor}40`,
                            }}>
                              <Clock size={11} /> {daysLeft} ngày còn lại
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                              HSD: {wl.end.toLocaleDateString('vi-VN')}
                            </div>
                          </div>

                          {/* Radio */}
                          <div style={{
                            width: 20, height: 20, borderRadius: '50', flexShrink: 0,
                            border: `2px solid ${isSelected ? '#6366f1' : 'var(--border)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isSelected ? '#6366f1' : 'transparent',
                            transition: 'all 0.18s',
                          }}>
                            {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {products.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <button
                      className="btn btn-primary"
                      disabled={!selectedProduct}
                      onClick={() => setStep(2)}
                      style={{ gap: 8 }}
                    >
                      Tiếp theo <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Hình thức & mô tả ───────────────────── */}
            {step === 2 && (
              <div>
                {/* Selected product recap */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: 'var(--surface-3)', borderRadius: 12,
                  border: '1px solid var(--border)', marginBottom: 24,
                }}>
                  <Shield size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sản phẩm: </span>
                    <strong>{selectedProduct.product_name}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· Đơn #{selectedProduct.order_code}</span>
                  </div>
                </div>

                {/* Chọn hình thức */}
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Chọn hình thức bảo hành</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
                  {METHODS.map(m => {
                    const sel = form.hinh_thuc === m.key;
                    return (
                      <div
                        key={m.key}
                        onClick={() => setForm(f => ({ ...f, hinh_thuc: m.key, lich_hen: '' }))}
                        style={{
                          padding: '18px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                          border: `1.5px solid ${sel ? m.color : 'var(--border)'}`,
                          background: sel ? m.bg : 'var(--surface-2)',
                          boxShadow: sel ? `0 0 0 3px ${m.border}` : 'none',
                          transition: 'all 0.18s',
                        }}
                      >
                        <div style={{ color: sel ? m.color : 'var(--text-muted)', marginBottom: 10, transition: 'color 0.18s' }}>
                          {m.icon}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: sel ? m.color : 'var(--text-primary)' }}>
                          {m.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {m.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hẹn giờ (khi chọn đến cửa hàng) */}
                {form.hinh_thuc === 'den_cua_hang' && (
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} /> Chọn ngày & giờ hẹn đến cửa hàng *
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      min={minDatetime}
                      value={form.lich_hen}
                      onChange={e => setForm(f => ({ ...f, lich_hen: e.target.value }))}
                      required
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      🕗 Giờ làm việc: 8:00 – 20:00, từ thứ 2 đến Chủ nhật
                    </div>
                  </div>
                )}

                {/* Địa chỉ cửa hàng nếu chọn bưu điện / ship về */}
                {(form.hinh_thuc === 'buu_dien' || form.hinh_thuc === 'ship_ve') && (
                  <div style={{
                    display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
                    marginBottom: 16,
                  }}>
                    <MapPin size={15} style={{ color: '#6366f1', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                      <strong>Địa chỉ gửi hàng:</strong><br />
                      TechStore — 123 Nguyễn Văn Cừ, Quận 5, TP.HCM<br />
                      <span style={{ color: 'var(--text-muted)' }}>ĐT: 1800 1234 · Ghi rõ "BẢO HÀNH" trên kiện hàng</span>
                    </div>
                  </div>
                )}

                {/* Mô tả sự cố */}
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} /> Mô tả sự cố *
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Mô tả chi tiết hỏng hóc: màn hình bị sọc, pin không sạc được, phím không nhận, thiết bị tự tắt..."
                    value={form.issue_description}
                    onChange={e => setForm(f => ({ ...f, issue_description: e.target.value }))}
                    required
                  />
                </div>

                {/* SĐT */}
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} /> Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="0901234567"
                    value={form.so_dien_thoai}
                    onChange={e => setForm(f => ({ ...f, so_dien_thoai: e.target.value }))}
                  />
                </div>

                {/* Serial (optional) */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Info size={14} /> Số Serial / IMEI <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(không bắt buộc)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="VD: SN12345678"
                    value={form.so_serial}
                    onChange={e => setForm(f => ({ ...f, so_serial: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Quay lại</button>
                  <button
                    className="btn btn-primary"
                    style={{ gap: 8 }}
                    disabled={!form.hinh_thuc || !form.issue_description.trim() || (form.hinh_thuc === 'den_cua_hang' && !form.lich_hen)}
                    onClick={() => setStep(3)}
                  >
                    Xem lại <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Xác nhận ─────────────────────────────── */}
            {step === 3 && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Xác nhận yêu cầu bảo hành</h3>

                {/* Summary card */}
                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  border: '1.5px solid var(--border)',
                  marginBottom: 24,
                }}>
                  {[
                    { label: 'Sản phẩm',      value: selectedProduct?.product_name },
                    { label: 'Đơn hàng',       value: `#${selectedProduct?.order_code}` },
                    { label: 'Hình thức',       value: METHODS.find(m => m.key === form.hinh_thuc)?.label },
                    ...(form.hinh_thuc === 'den_cua_hang' && form.lich_hen
                      ? [{ label: 'Thời gian hẹn', value: new Date(form.lich_hen).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' }) }]
                      : []),
                    { label: 'SĐT liên hệ',   value: form.so_dien_thoai || '(chưa nhập)' },
                    ...(form.so_serial ? [{ label: 'Serial/IMEI', value: form.so_serial }] : []),
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', padding: '12px 18px',
                      background: i % 2 === 0 ? 'var(--surface-2)' : 'var(--surface-3)',
                      fontSize: '0.88rem',
                    }}>
                      <span style={{ color: 'var(--text-muted)', width: 130, flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ padding: '12px 18px', background: 'var(--surface-2)', fontSize: '0.88rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Mô tả sự cố</div>
                    <div style={{ fontWeight: 500, lineHeight: 1.6 }}>{form.issue_description}</div>
                  </div>
                </div>

                {/* Notice */}
                <div style={{
                  display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                  marginBottom: 24, fontSize: '0.82rem', lineHeight: 1.6,
                }}>
                  <AlertCircle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    Sau khi gửi yêu cầu, nhân viên sẽ liên hệ qua SĐT trong vòng <strong>24–48 giờ</strong> làm việc.
                    Bạn sẽ nhận thông báo khi trạng thái bảo hành được cập nhật.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Chỉnh sửa</button>
                  <button
                    className="btn btn-primary"
                    style={{ gap: 8 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Đang gửi...</>
                      : <><Send size={14} /> Gửi yêu cầu bảo hành</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          DANH SÁCH YÊU CẦU BẢO HÀNH
         ══════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
          Lịch sử bảo hành {requests.length > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({requests.length})</span>}
        </h2>
      </div>

      {requests.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'var(--surface-2)', borderRadius: 20,
          border: '1.5px dashed var(--border)',
        }}>
          <Shield size={44} style={{ opacity: 0.25, marginBottom: 14 }} />
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Chưa có yêu cầu bảo hành</div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Nhấn <strong>"Tạo yêu cầu bảo hành"</strong> ở trên khi sản phẩm gặp sự cố
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map(r => {
            const s = STATUS_MAP[r.status] || STATUS_MAP.cho_xu_ly;
            const method = METHODS.find(m => m.key === r.hinh_thuc);
            return (
              <div key={r.id} className="card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                {/* Status bar */}
                <div style={{ height: 3, background: s.color }} />
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      {/* Product name */}
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.product_name}</div>
                      {/* Meta */}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span>📦 Đơn #{r.order_code}</span>
                        <span>📅 {new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                        {method && (
                          <span style={{ color: method.color }}>
                            {method.icon} {method.label}
                          </span>
                        )}
                        {r.lich_hen && (
                          <span>🕐 Hẹn: {new Date(r.lich_hen).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        )}
                      </div>
                      {/* Issue */}
                      <div style={{
                        fontSize: '0.85rem', color: 'var(--text-secondary)',
                        background: 'var(--surface-3)', padding: '8px 12px', borderRadius: 8,
                        lineHeight: 1.5,
                      }}>
                        🛠️ {r.issue_description}
                      </div>
                      {/* Admin note */}
                      {r.admin_note && (
                        <div style={{
                          marginTop: 10, fontSize: '0.83rem', fontWeight: 600,
                          background: s.bg, color: s.color,
                          padding: '8px 12px', borderRadius: 8,
                          border: `1px solid ${s.color}30`,
                        }}>
                          📋 Phản hồi: {r.admin_note}
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700,
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.color}35`,
                      }}>
                        {s.icon} {s.label}
                      </div>
                      {r.completed_at && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                          Hoàn thành: {new Date(r.completed_at).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div></div>
  );
}
