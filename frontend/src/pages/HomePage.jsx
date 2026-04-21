import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Truck, RefreshCw, Headphones, Star, ArrowRight,
         TrendingUp, Clock, Award, Zap, Ticket } from 'lucide-react';
import { productApi, categoryApi, voucherApi } from '../api';
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

  const [hH, hM, hS] = useCountdown(5, 59, 59);
  const tabsRef  = useRef(null);
  const navigate = useNavigate();

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
              {/* Countdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[hH, hM, hS].map((v, i) => (
                  <>
                    <div key={i} style={{
                      minWidth: 44, padding: '6px 10px', background: '#ef4444',
                      borderRadius: 8, textAlign: 'center',
                      fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                      boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                    }}>{v}</div>
                    {i < 2 && <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.1rem' }}>:</span>}
                  </>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {['GIỜ', 'PHÚT', 'GIÂY'].map((l, i) => (
                  <span key={i} style={{ minWidth: 44, textAlign: 'center' }}>{l}</span>
                ))}
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
                  {flashProducts.map(p => <ProductCard key={p.id} product={p} />)}
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
            <div style={{ background: '#fff', padding: '24px 32px', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>Mã giảm giá</h2>
              <div style={{
                display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 12,
                scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none'
              }}>
                {publicVouchers.map(v => {
                  let discountTitle = '';
                  if (v.discount_type === 'percent') discountTitle = `GIẢM ${v.discount_value}%`;
                  else if (v.discount_type === 'freeship') discountTitle = 'MIỄN SHIP';
                  else discountTitle = `GIẢM ${fmt(v.discount_value).replace(/\s?₫/, 'Đ')}`;

                  return (
                    <div key={v.id} style={{
                      display: 'flex', minWidth: 320, maxWidth: 360,
                      background: '#f4f4f4', borderRadius: 8, overflow: 'hidden', flexShrink: 0
                    }}>
                      {/* Left: Red Card */}
                      <div style={{
                        background: '#dc2626', width: 90, position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRight: '2px dashed rgba(255,255,255,0.4)',
                        maskImage: 'radial-gradient(circle at 0px 50%, transparent 6px, black 7px)',
                        WebkitMaskImage: 'radial-gradient(circle at -2px center, transparent 6px, black 7px)'
                      }}>
                        <Ticket size={34} color="#fff" />
                      </div>

                      {/* Right: Info */}
                      <div style={{ padding: '16px 20px', flex: 1, position: 'relative' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', marginBottom: 6 }}>{discountTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: 2 }}>Mã: <strong style={{ color: '#000' }}>{v.code}</strong></div>
                        <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: 14 }}>HSD: {new Date(v.expires_at).toLocaleDateString('vi-VN')}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(v.code);
                              toast.success(`Đã chép mã ${v.code}!`);
                            }}
                            style={{
                              background: '#dc2626', color: '#fff', border: 'none',
                              padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem',
                              fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                            onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
                          >
                            Sao chép
                          </button>
                          <span style={{ fontSize: '0.75rem', color: '#dc2626', cursor: 'pointer' }}>Điều kiện</span>
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
                {gamingProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
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
                {officeProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
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
                {(tabProducts[activeTab] || []).map(p => <ProductCard key={p.id} product={p} />)}
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
