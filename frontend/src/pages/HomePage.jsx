import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Truck, RefreshCw, Headphones, Star, ArrowRight,
         TrendingUp, Clock, Award, Zap, Ticket, X } from 'lucide-react';
import { productApi, categoryApi, voucherApi, wishlistApi } from '../api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: <Shield size={22} />,    title: 'Hàng chính hãng',  desc: 'Bảo hành chính thức từ hãng 12-24 tháng', color: 'green' },
  { icon: <Truck size={22} />,     title: 'Giao hàng nhanh',  desc: 'Giao trong 2-3 ngày toàn quốc',           color: 'blue'  },
  { icon: <RefreshCw size={22} />, title: 'Đổi trả 15 ngày',  desc: 'Lỗi 1 đổi 1 trong 15 ngày đầu',          color: 'amber' },
  { icon: <Headphones size={22} />,title: 'Hỗ trợ 24/7',      desc: 'Tư vấn kỹ thuật online mọi lúc',         color: 'red'   },
];

const TABS = [
  { key: 'new',        label: '🆕 Sản phẩm mới',  sort: 'newest',  featured: '' },
  { key: 'bestseller', label: '🔥 Bán chạy nhất', sort: 'popular', featured: '' },
  { key: 'featured',   label: '⭐ Nổi bật',        sort: 'popular', featured: '1' },
];

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

/* ── countdown helper ── */
function useCountdown(initH = 5, initM = 59, initS = 59) {
  const [t, setT] = useState({ h: initH, m: initM, s: initS });
  useEffect(() => {
    const id = setInterval(() => {
      setT(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return [pad(t.h), pad(t.m), pad(t.s)];
}

export default function HomePage() {
  const [heroProducts,    setHeroProducts]    = useState([]);
  const [flashProducts,   setFlashProducts]   = useState([]);
  const [publicVouchers,  setPublicVouchers]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeTab,       setActiveTab]       = useState('new');
  const [tabProducts,     setTabProducts]     = useState({});
  const [tabLoading,      setTabLoading]      = useState(false);
  const [gamingProducts,  setGamingProducts]  = useState([]);
  const [officeProducts,  setOfficeProducts]  = useState([]);
  const [gamingCatId,     setGamingCatId]     = useState(null);
  const [officeCatId,     setOfficeCatId]     = useState(null);

  const { user } = useAuth();
  const [hH, hM, hS] = useCountdown(5, 59, 59);
  const tabsRef  = useRef(null);
  const navigate = useNavigate();
  const [infoVoucher, setInfoVoucher] = useState(null);
  const [claimedIds,   setClaimedIds] = useState(new Set());
  const [wishlistIds,  setWishlistIds] = useState([]);

  // Load danh sách voucher đã nhận từ DB (persist sau reload)
  useEffect(() => {
    if (!user) { setClaimedIds(new Set()); return; }
    voucherApi.getMine()
      .then(r => {
        const ids = new Set((r.data.data || []).map(v => v.id));
        setClaimedIds(ids);
      })
      .catch(() => {});
  }, [user]);

  // Load wishlist
  const loadWishlist = useCallback(() => {
    if (!user) { setWishlistIds([]); return; }
    wishlistApi.getAll().then(r => setWishlistIds(r.data.data.map(i => i.product_id))).catch(() => {});
  }, [user]);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  useEffect(() => {
    window.addEventListener('wishlistChanged', loadWishlist);
    return () => window.removeEventListener('wishlistChanged', loadWishlist);
  }, [loadWishlist]);

  useEffect(() => {
    document.title = 'TechStore – Thiết bị công nghệ chính hãng';

    Promise.all([
      productApi.getAll({ sort: 'price_desc', limit: 48 }),
      categoryApi.getAll(),
      voucherApi.getPublic().catch(() => ({ data: { data: [] } })),
    ]).then(([prodRes, catRes, voucherRes]) => {
      const allProds = prodRes.data.data || [];
      const vouchers = voucherRes.data?.data || [];
      setPublicVouchers(vouchers);

      // Hero: top 3 giảm giá cao nhất
      const saleProds = allProds
        .filter(p => p.sale_price && p.price > p.sale_price)
        .sort((a, b) => ((b.price - b.sale_price) / b.price) - ((a.price - a.sale_price) / a.price));
      setHeroProducts(saleProds.slice(0, 3));

      // Flash sale: top 4 giảm nhiều nhất
      setFlashProducts(saleProds.slice(0, 4));

      // Category IDs
      const cats = catRes.data.data || [];
      const gamingCat  = cats.find(c => c.slug === 'laptop-gaming');
      const officeCat  = cats.find(c => c.slug === 'laptop-van-phong');
      if (gamingCat) setGamingCatId(gamingCat.id);
      if (officeCat) setOfficeCatId(officeCat.id);

      // Load gaming + office products
      const reqs = [];
      if (gamingCat) reqs.push(productApi.getAll({ category: gamingCat.id, limit: 4, sort: 'popular' }));
      if (officeCat) reqs.push(productApi.getAll({ category: officeCat.id, limit: 4, sort: 'popular' }));
      return Promise.all(reqs).then(results => {
        if (gamingCat) setGamingProducts(results[0]?.data?.data || []);
        if (officeCat) setOfficeProducts(results[gamingCat ? 1 : 0]?.data?.data || []);
      });
    }).finally(() => setLoading(false));
  }, []);

  const loadTab = useCallback(async (tabKey) => {
    if (tabProducts[tabKey]) return;
    setTabLoading(true);
    try {
      const tab = TABS.find(t => t.key === tabKey);
      const params = { sort: tab.sort, limit: 5 };
      if (tab.featured) params.featured = tab.featured;
      const res = await productApi.getAll(params);
      setTabProducts(prev => ({ ...prev, [tabKey]: res.data.data }));
    } catch (_) {}
    finally { setTabLoading(false); }
  }, [tabProducts]);

  useEffect(() => { loadTab('new'); }, []);

  const handleTabChange = key => {
    setActiveTab(key);
    loadTab(key);
  };

  const scrollToBestseller = () => {
    handleTabChange('bestseller');
    setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  return (
    <div>
      {/* ── Voucher Info Modal ── */}
      {infoVoucher && (
        <div
          onClick={() => setInfoVoucher(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface-1)',
              borderRadius: 10, overflow: 'hidden',
              width: '100%', maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              animation: 'fadeInUp 0.2s ease',
            }}
          >
            {/* Header đỏ */}
            <div style={{
              background: '#e53e3e', padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Thông tin voucher</span>
              <button
                onClick={() => setInfoVoucher(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#fff', width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                { label: 'Tên voucher:', value: infoVoucher.name, bold: true },
                {
                  label: 'Loại:',
                  value: infoVoucher.discount_type === 'percent'
                    ? `Giảm ${infoVoucher.discount_value}%${infoVoucher.max_discount ? ` (tối đa ${fmt(infoVoucher.max_discount)})` : ''}`
                    : infoVoucher.discount_type === 'fixed_amount'
                    ? `Giảm ${fmt(infoVoucher.discount_value)}`
                    : 'Miễn phí vận chuyển',
                  bold: true,
                },
                {
                  label: 'Ngày hết hạn:',
                  value: infoVoucher.expires_at
                    ? new Date(infoVoucher.expires_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Không giới hạn',
                  bold: true,
                },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ color: '#e53e3e', fontWeight: 600, fontSize: '0.88rem', minWidth: 110, flexShrink: 0, paddingTop: 2 }}>
                    {row.label}
                  </span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {row.bold ? <strong>{row.value}</strong> : row.value}
                  </div>
                </div>
              ))}

              {/* Điều kiện */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ color: '#e53e3e', fontWeight: 600, fontSize: '0.88rem', minWidth: 110, flexShrink: 0, paddingTop: 2 }}>
                  Điều kiện:
                </span>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                  {infoVoucher.min_order > 0 && (
                    <div>Áp dụng cho đơn hàng từ {fmt(infoVoucher.min_order)} trở lên</div>
                  )}
                  {infoVoucher.discount_type === 'percent' && (
                    <div>
                      Giảm {infoVoucher.discount_value}%
                      {infoVoucher.max_discount ? ` (tối đa ${fmt(infoVoucher.max_discount)})` : ''}
                    </div>
                  )}
                  {infoVoucher.discount_type === 'fixed_amount' && (
                    <div>Giảm cố định {fmt(infoVoucher.discount_value)}</div>
                  )}
                  {infoVoucher.discount_type === 'freeship' && (
                    <div>Miễn phí vận chuyển</div>
                  )}
                  <div>Mỗi tài khoản chỉ sử dụng được 1 lần</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setInfoVoucher(null)}
                className="btn btn-sm"
                style={{ background: '#e53e3e', border: 'none', color: '#fff', fontWeight: 700 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero__layout">
            <div className="hero__content">
              <h1 className="hero__title">
                Công nghệ<br />
                <span className="highlight">Đỉnh Cao</span><br />
                Giá Tốt Nhất
              </h1>
              <p className="hero__desc">
                Hàng nghìn thiết bị công nghệ chính hãng. Laptop gaming, màn hình 4K, phụ kiện cao cấp — tất cả tại TechStore.
              </p>
              <div className="hero__cta">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                  Mua sắm ngay <ArrowRight size={18} />
                </button>
                <button className="btn btn-outline btn-lg" onClick={scrollToBestseller}>
                  Xem bán chạy 🔥
                </button>
              </div>
              <div className="hero__stats">
                {[{ v: '500+', l: 'Sản phẩm' }, { v: '10K+', l: 'Khách hàng' }, { v: '4.9★', l: 'Đánh giá' }].map(s => (
                  <div key={s.l}>
                    <div className="hero__stat-value">{s.v}</div>
                    <div className="hero__stat-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero: 3 sản phẩm giảm giá cao nhất */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {loading
                ? <div className="spinner-wrap"><div className="spinner" /></div>
                : heroProducts.slice(0, 3).map(p => {
                  const discPct = p.sale_price ? Math.round(((p.price - p.sale_price) / p.price) * 100) : 0;
                  return (
                    <Link key={p.id} to={`/shop/${p.slug}`} style={{
                      display: 'flex', gap: 14, padding: 14,
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(10px)',
                      transition: 'all var(--transition)', textDecoration: 'none',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <img src={p.thumbnail} alt={p.name}
                        style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, background: 'var(--surface-3)', flexShrink: 0 }}
                        onError={e => { e.target.src = `https://placehold.co/72x54/334155/3B82F6?text=Tech`; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 2 }}>{p.brand_name}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent)' }}>
                          {fmt(p.sale_price || p.price)}
                          {p.sale_price && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6, fontWeight: 400 }}>{fmt(p.price)}</span>}
                        </div>
                      </div>
                      {discPct > 0 && <span className="badge badge-sale" style={{ alignSelf: 'center', flexShrink: 0 }}>-{discPct}%</span>}
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={`stat-card__icon icon-${f.color}`} style={{ width: 44, height: 44, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH SALE ──────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(239,68,68,0.12)',
          }}>
            {/* Flash Sale Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
              padding: '18px 28px',
              background: 'linear-gradient(90deg, rgba(239,68,68,0.18) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={22} fill="#ef4444" color="#ef4444" />
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444', letterSpacing: 1, textTransform: 'uppercase' }}>Flash Sale</span>
              </div>
              <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Kết thúc sau:</span>
              {/* Countdown with aligned labels */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                {[hH, hM, hS].map((v, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{
                      minWidth: 44, padding: '6px 10px', background: '#ef4444',
                      borderRadius: 8, textAlign: 'center',
                      fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                      boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                    }}>{v}</div>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: 0.5, fontWeight: 600 }}>
                      {['GIỜ', 'PHÚT', 'GIÂY'][i]}
                    </span>
                    {i < 2 && <span style={{ position: 'absolute', top: 6, fontSize: '1.1rem', color: '#ef4444', fontWeight: 900 }}></span>}
                  </div>
                ))}
                {/* colon separators */}
              </div>
              <Link to="/shop?sort=price_desc" className="btn btn-sm" style={{
                background: '#ef4444', color: '#fff', border: 'none',
                marginLeft: 'auto', borderRadius: 20, padding: '6px 16px', fontWeight: 700, fontSize: '0.82rem',
              }}>
                Xem tất cả →
              </Link>
            </div>

            {/* Products */}
            <div style={{ padding: '20px 28px' }}>
              {loading ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : flashProducts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Không có sản phẩm đang sale</p>
              ) : (
                <div className="products-grid">
                  {flashProducts.map(p => <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VOUCHERS ────────────────────────────────── */}
      {publicVouchers.length > 0 && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              padding: '24px 28px', borderRadius: 'var(--radius-xl)',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>🏷️ Mã giảm giá</h2>
              <div style={{
                display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
                scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none'
              }}>
                {publicVouchers.map(v => {
                  let discountTitle = '';
                  let subLabel = '';
                  const isFree = v.discount_type === 'freeship';
                  const isPct  = v.discount_type === 'percent';
                  if (isPct)   { discountTitle = `GIẢM ${v.discount_value}%`; subLabel = v.max_discount_amount ? `Tối đa ${fmt(v.max_discount_amount)}` : ''; }
                  else if (isFree) { discountTitle = 'MIỄN SHIP'; subLabel = 'Freeship toàn quốc'; }
                  else { discountTitle = `GIẢM ${fmt(v.discount_value).replace(/\s?₫/,'Đ')}`; subLabel = ''; }

                  const accentColor = isFree ? 'var(--emerald)' : 'var(--accent)';
                  const accentHex   = isFree ? '#10B981'         : '#3B82F6';

                  return (
                    <div key={v.id} style={{
                      display: 'flex', minWidth: 300, maxWidth: 340, flexShrink: 0,
                      background: 'var(--surface-1)',
                      border: `1px solid ${accentHex}33`,
                      borderRadius: 12, overflow: 'hidden',
                      transition: 'box-shadow 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${accentHex}30`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      {/* Left notch side */}
                      <div style={{
                        width: 80, flexShrink: 0,
                        background: `linear-gradient(160deg, ${accentHex}, ${accentHex}BB)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: 6, padding: '12px 0',
                        position: 'relative',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
                      }}>
                        <Ticket size={26} color="rgba(255,255,255,0.9)" />
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 800, textAlign: 'center', letterSpacing: 0.5 }}>
                          {isFree ? 'FREE\nSHIP' : isPct ? 'SALE' : 'GIẢM'}
                        </span>
                      </div>

                      {/* Dashed separator */}
                      <div style={{
                        width: 1, borderLeft: `2px dashed ${accentHex}44`,
                        margin: '12px 0', flexShrink: 0,
                      }} />

                      {/* Right: Info */}
                      <div style={{ padding: '14px 16px', flex: 1 }}>
                        <div style={{
                          fontSize: '0.98rem', fontWeight: 800,
                          color: accentColor, marginBottom: 4,
                        }}>{discountTitle}</div>
                        {subLabel && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{subLabel}</div>}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                          HSD: {v.expires_at ? new Date(v.expires_at).toLocaleDateString('vi-VN') : '12/12/2026'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <button
                            onClick={async () => {
                              if (!user) { navigate('/login'); return; }
                              try {
                                await voucherApi.claim(v.id);
                                setClaimedIds(prev => new Set([...prev, v.id]));
                                toast.success(`Đã nhận voucher ${v.code}! Xem tại "Voucher của tôi"`);
                              } catch (err) {
                                toast.error(err.response?.data?.message || 'Không thể nhận vôucher!');
                              }
                            }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              background: claimedIds.has(v.id) ? 'var(--surface-3)' : accentColor,
                              color: claimedIds.has(v.id) ? 'var(--text-muted)' : '#fff',
                              border: 'none',
                              padding: '5px 14px', borderRadius: 20,
                              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                              transition: 'opacity 0.15s',
                              pointerEvents: claimedIds.has(v.id) ? 'none' : 'auto',
                            }}
                            onMouseEnter={e => { if (!claimedIds.has(v.id)) e.currentTarget.style.opacity = '0.85'; }}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >
                            {claimedIds.has(v.id) ? '✓ Đã nhận' : 'Nhận'}
                          </button>
                          <button
                            onClick={() => setInfoVoucher(v)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: '0.72rem', color: accentColor, fontWeight: 600,
                              padding: '2px 6px', borderRadius: 4,
                              transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >Điều kiện</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LAPTOP GAMING + VĂN PHÒNG ─────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

            {/* ── Laptop Gaming ── */}
            <div>
              {/* Banner */}
              <div
                onClick={() => navigate(gamingCatId ? `/shop?category=${gamingCatId}` : '/shop')}
                style={{
                  padding: '24px 28px', borderRadius: 'var(--radius-xl)', cursor: 'pointer', marginBottom: 20,
                  background: 'linear-gradient(135deg, #0f172a, rgba(59,130,246,0.12))',
                  border: '1px solid rgba(59,130,246,0.3)',
                  transition: 'all var(--transition)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎮</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>Laptop Gaming</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Hiệu năng vượt trội cho game thủ</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.88rem' }}>Xem tất cả →</span>
                  {gamingCatId && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RTX 4090 · 240Hz · Gen mới</span>}
                </div>
              </div>
              {/* 4 Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {gamingProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} />)}
              </div>
            </div>

            {/* ── Laptop Văn phòng ── */}
            <div>
              {/* Banner */}
              <div
                onClick={() => navigate(officeCatId ? `/shop?category=${officeCatId}` : '/shop')}
                style={{
                  padding: '24px 28px', borderRadius: 'var(--radius-xl)', cursor: 'pointer', marginBottom: 20,
                  background: 'linear-gradient(135deg, #0f172a, rgba(16,185,129,0.10))',
                  border: '1px solid rgba(16,185,129,0.3)',
                  transition: 'all var(--transition)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>💼</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>Laptop Văn phòng</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Mỏng nhẹ, pin trâu, lý tưởng công việc</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.88rem' }}>Xem tất cả →</span>
                  {officeCatId && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mỏng nhẹ · Pin 12h · Business</span>}
                </div>
              </div>
              {/* 4 Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {officeProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} />)}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PRODUCT TABS ─────────────────────────────── */}
      <section className="section" ref={tabsRef} style={{ scrollMarginTop: 80 }}>
        <div className="container">
          <div className="product-tabs">
            <div className="product-tabs__header">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`product-tabs__btn${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
              <Link
                to={`/shop?${activeTab === 'bestseller' ? 'sort=popular' : activeTab === 'featured' ? 'featured=1' : 'sort=newest'}`}
                className="product-tabs__see-all"
              >
                Xem thêm <ChevronRight size={13} />
              </Link>
            </div>
            {tabLoading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : (
              <div className="product-tabs__grid">
                {(tabProducts[activeTab] || []).map(p => <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} />)}
                {(tabProducts[activeTab] || []).length === 0 && !tabLoading && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang tải...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── LOYALTY BANNER ───────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--surface-2), var(--surface-1))',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-xl)', padding: '40px 48px',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.8rem' }}>⭐</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber)' }}>Chương trình tích điểm</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 500 }}>
                Mỗi <strong style={{ color: 'var(--text-primary)' }}>100.000đ</strong> mua hàng = <strong style={{ color: 'var(--amber)' }}>1 điểm</strong>.
                Dùng điểm để giảm tiền khi thanh toán: <strong style={{ color: 'var(--text-primary)' }}>1 điểm = 1.000đ</strong>. Tích lũy không giới hạn!
              </p>
              <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
                {[{ v: '100K', l: '= 1 điểm' }, { v: '1K', l: 'mỗi điểm' }, { v: '∞', l: 'Không hết hạn' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber)' }}>{s.v}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">Đăng ký ngay <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="section-title">Khách hàng nói gì về chúng tôi?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { name: 'Nguyễn Văn An',  comment: 'Laptop ASUS ROG tuyệt vời, giao hàng nhanh, hàng chính hãng đúng như mô tả. Shop tư vấn nhiệt tình!', rating: 5 },
              { name: 'Trần Thị Bình',  comment: 'Mua màn hình Samsung Odyssey G7, màu đẹp, cong rất thích. Sẽ ủng hộ TechStore lần sau.', rating: 5 },
              { name: 'Lê Văn Cường',   comment: 'Giá tốt nhất thị trường, bảo hành rõ ràng, nhân viên hỗ trợ kỹ thuật rất giỏi.', rating: 4 },
            ].map((r, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <div className="stars" style={{ marginBottom: 10 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= r.rating ? 'var(--amber)' : 'none'} color={s <= r.rating ? 'var(--amber)' : 'var(--surface-3)'} />)}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic' }}>&ldquo;{r.comment}&rdquo;</p>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>— {r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
