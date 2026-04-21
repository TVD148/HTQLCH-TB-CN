import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Shield, Truck, RefreshCw, Headphones, Star, ArrowRight,
         Laptop, Monitor, Mouse, HardDrive, Cpu, Wifi, TrendingUp, Clock, Award } from 'lucide-react';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  'laptop':           <Laptop  size={22} />,
  'dien-thoai':       '📱',
  'man-hinh':         <Monitor size={22} />,
  'phu-kien':         <Mouse   size={22} />,
  'o-cung-ram':       <HardDrive size={22} />,
  'thiet-bi-mang':    <Wifi   size={22} />,
  'pc-may-tinh-ban':  <Cpu    size={22} />,
};

function CountdownTimer({ targetHours = 8 }) {
  const [time, setTime] = useState({ h: targetHours, m: 30, s: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) h = 0;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flash-sale__countdown">
      {[{ label: 'Giờ', val: time.h }, { label: 'Phút', val: time.m }, { label: 'Giây', val: time.s }].map((t, i) => (
        <div key={i} className="countdown-block">
          <span className="countdown-block__num">{pad(t.val)}</span>
          <span className="countdown-block__label">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

const FEATURES = [
  { icon: <Shield size={22} />,    title: 'Hàng chính hãng',  desc: 'Bảo hành chính thức từ hãng 12-24 tháng', color: 'green' },
  { icon: <Truck size={22} />,     title: 'Giao hàng nhanh',  desc: 'Giao trong 2-3 ngày toàn quốc',          color: 'blue'  },
  { icon: <RefreshCw size={22} />, title: 'Đổi trả 15 ngày',  desc: 'Lỗi 1 đổi 1 trong 15 ngày đầu',          color: 'amber' },
  { icon: <Headphones size={22} />,title: 'Hỗ trợ 24/7',      desc: 'Tư vấn kỹ thuật online mọi lúc',         color: 'red'   },
];

const TABS = [
  { key: 'new',        label: '🆕 Sản phẩm mới',  icon: <Clock   size={15} />, sort: 'newest',     featured: '' },
  { key: 'bestseller', label: '🔥 Bán chạy nhất', icon: <TrendingUp size={15} />, sort: 'bestseller', featured: '' },
  { key: 'featured',   label: '⭐ Nổi bật',        icon: <Award   size={15} />, sort: 'popular',    featured: '1' },
];

export default function HomePage() {
  const [flashProducts, setFlashProducts] = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [loading,       setLoading]       = useState(true);

  // Tab state
  const [activeTab, setActiveTab]       = useState('new');
  const [tabProducts, setTabProducts]   = useState({});
  const [tabLoading,  setTabLoading]    = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'TechStore – Thiết bị công nghệ chính hãng';
    Promise.all([
      productApi.getAll({ featured: '1', limit: 4 }),
      categoryApi.getAll(),
    ]).then(([flashRes, catRes]) => {
      setFlashProducts(flashRes.data.data);
      setCategories(catRes.data.data.filter(c => !c.parent_id).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  const loadTab = useCallback(async (tabKey) => {
    if (tabProducts[tabKey]) return; // Cached
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

  const handleTabChange = (key) => {
    setActiveTab(key);
    loadTab(key);
  };

  const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero__layout">
            <div className="hero__content">
              <div className="hero__tag">
                <Zap size={14} /> Flash Sale ngày hôm nay – Giảm đến 30%
              </div>
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
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/shop?sort=bestseller')}>
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

            {/* Hero product showcase */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {flashProducts.slice(0, 2).map(p => (
                <Link key={p.id} to={`/shop/${p.slug}`} style={{
                  display: 'flex', gap: 14, padding: 16,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(10px)',
                  transition: 'all var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <img src={p.thumbnail} alt={p.name}
                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, background: 'var(--surface-3)' }}
                    onError={e => { e.target.src = `https://placehold.co/80x60/334155/3B82F6?text=Tech`; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>{p.brand_name}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{p.name}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)' }}>
                      {fmt(p.sale_price || p.price)}
                    </div>
                  </div>
                  {p.sale_price && (
                    <span className="badge badge-sale">-{Math.round(((p.price - p.sale_price)/p.price)*100)}%</span>
                  )}
                </Link>
              ))}
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

      {/* ─── CATEGORIES ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Danh mục sản phẩm</h2>
              <p className="section-subtitle">Khám phá danh mục thiết bị công nghệ</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">Xem tất cả <ChevronRight size={14} /></Link>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat.id} className="category-card" onClick={() => navigate(`/shop?category=${cat.id}`)}>
                <div className="category-card__icon">
                  {CATEGORY_ICONS[cat.slug] || <Cpu size={22} />}
                </div>
                <div className="category-card__name">{cat.name}</div>
                <div className="category-card__count">{cat.product_count || 0} sản phẩm</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH SALE ───────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div className="flash-sale">
            <div className="flash-sale__header">
              <div className="flash-sale__title">
                <Zap size={20} fill="currentColor" /> FLASH SALE
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kết thúc sau:</span>
              <CountdownTimer />
            </div>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : (
              <div className="products-grid">
                {flashProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT TABS (Mới / Bán chạy / Nổi bật) ─── */}
      <section className="section">
        <div className="container">
          {/* Tab header */}
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
                to={`/shop?${activeTab === 'bestseller' ? 'sort=bestseller' : activeTab === 'featured' ? 'featured=1' : 'sort=newest'}`}
                className="product-tabs__see-all"
              >
                Xem thêm <ChevronRight size={13} />
              </Link>
            </div>

            {/* Tab content */}
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

      {/* ─── PROMO BANNER ─────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { title: 'Laptop Gaming', desc: 'Hiệu năng vượt trội cho game thủ', color: '#3B82F6', emoji: '🎮' },
              { title: 'MacBook Pro M3', desc: 'Chip M3 Max — Sức mạnh không giới hạn', color: '#10B981', emoji: '💻' },
            ].map(b => (
              <div key={b.title} onClick={() => navigate('/shop')} style={{
                padding: '28px 32px', borderRadius: 'var(--radius-xl)', cursor: 'pointer',
                background: `linear-gradient(135deg, var(--surface-2), rgba(${b.color === '#3B82F6' ? '59,130,246' : '16,185,129'},0.08))`,
                border: `1px solid rgba(${b.color === '#3B82F6' ? '59,130,246' : '16,185,129'},0.2)`,
                transition: 'all var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{b.emoji}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>{b.title}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16 }}>{b.desc}</div>
                <span style={{ color: b.color, fontWeight: 600, fontSize: '0.88rem' }}>Xem ngay → </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOYALTY BANNER ───────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--surface-2), var(--surface-1))',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'center',
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
                {[
                  { v: '100K', l: '= 1 điểm' },
                  { v: '1K',   l: 'mỗi điểm' },
                  { v: '∞',    l: 'Không hết hạn' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber)' }}>{s.v}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Đăng ký ngay <ArrowRight size={18} />
            </Link>
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
