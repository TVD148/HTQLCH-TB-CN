import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { productApi, categoryApi, brandApi, wishlistApi } from '../api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const SORT_OPTIONS = [
  { val: 'newest',     label: 'Mới nhất' },
  { val: 'popular',   label: 'Phổ biến nhất' },
  { val: 'price_asc',  label: 'Giá tăng dần' },
  { val: 'price_desc', label: 'Giá giảm dần' },
  { val: 'rating',     label: 'Đánh giá cao nhất' },
];

const PER_PAGE_OPTIONS = [12, 15, 18];

const TOP_BRANDS = ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'LG', 'Logitech', 'Razer'];

export default function ShopPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const [showAllCats,   setShowAllCats]   = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showPerPage, setShowPerPage] = useState(false);
  const perPageRef = useRef(null);

  // Filter state from URL
  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = parseInt(searchParams.get('page') || '1');
  const limit    = parseInt(searchParams.get('limit') || '12');
  const featured = searchParams.get('featured') || '';

  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? searchParams.get('brand').split(',').filter(Boolean) : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  // wishlist IDs – local state to handle heart toggle without page reload
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    document.title = 'Shop – TechStore';
    categoryApi.getAll().then(r => setCategories(r.data.data));
    brandApi.getAll().then(r => setBrands(r.data.data));
    // Load wishlist IDs so hearts are highlighted on page load
    if (user) {
      wishlistApi.getAll().then(r => {
        const ids = (r.data.data || []).map(i => i.product_id);
        setWishlistIds(ids);
      }).catch(() => {});
    }
  }, [user]);

  // Close per-page dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (perPageRef.current && !perPageRef.current.contains(e.target)) setShowPerPage(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, category, sort, page, limit };
      if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (featured) params.featured = featured;
      const res = await productApi.getAll(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch { }
    finally { setLoading(false); }
  }, [search, category, sort, page, limit, selectedBrands, minPrice, maxPrice, featured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, String(val)); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('min_price', minPrice); else next.delete('min_price');
    if (maxPrice) next.set('max_price', maxPrice); else next.delete('max_price');
    next.delete('page');
    setSearchParams(next);
  };

  const toggleBrand = (brandId) => {
    const id = String(brandId);
    const newBrands = selectedBrands.includes(id)
      ? selectedBrands.filter(b => b !== id)
      : [...selectedBrands, id];
    setSelectedBrands(newBrands);
    const next = new URLSearchParams(searchParams);
    if (newBrands.length > 0) next.set('brand', newBrands.join(',')); else next.delete('brand');
    next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => {
    setSelectedBrands([]); setMinPrice(''); setMaxPrice('');
    setSearchParams({});
  };

  const hasFilters = category || selectedBrands.length > 0 || minPrice || maxPrice || search;
  const parentCats = categories.filter(c => !c.parent_id);

  // Categories: show 5 by default
  const visibleCats = showAllCats ? parentCats : parentCats.slice(0, 5);

  // Brands: sort by top 10 popularity then show 10 by default
  const sortedBrands = [...brands].sort((a, b) => {
    const aIdx = TOP_BRANDS.indexOf(a.name);
    const bIdx = TOP_BRANDS.indexOf(b.name);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return (b.product_count || 0) - (a.product_count || 0);
  });
  const visibleBrands = showAllBrands ? sortedBrands : sortedBrands.slice(0, 5);

  // Pagination logic: show max 7 page buttons with ellipsis
  const buildPageNums = () => {
    const total = pagination.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    if (page <= 4) {
      pages.push(1,2,3,4,5,'…',total);
    } else if (page >= total - 3) {
      pages.push(1,'…',total-4,total-3,total-2,total-1,total);
    } else {
      pages.push(1,'…',page-1,page,page+1,'…',total);
    }
    return pages;
  };

  // Find selected category name for breadcrumb
  const selectedCat = categories.find(c => String(c.id) === String(category));

  return (
    <div className="section">
      <div className="container">

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color='var(--accent)'}
            onMouseLeave={e => e.target.style.color='var(--text-muted)'}>
            Trang chủ
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          {selectedCat ? (
            <>
              <Link to="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='var(--accent)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>
                Sản phẩm
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>›</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedCat.name}</span>
            </>
          ) : (
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {search ? `Tìm kiếm: "${search}"` : featured ? 'Sản phẩm nổi bật' : 'Sản phẩm'}
            </span>
          )}
        </nav>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, flex: 1 }}>
            {search ? `Kết quả: "${search}"` : featured ? '⭐ Sản phẩm nổi bật' : selectedCat ? selectedCat.name : 'Tất cả sản phẩm'}
          </h1>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select
              value={sort}
              onChange={e => setParam('sort', e.target.value)}
              style={{ appearance: 'none', padding: '8px 36px 8px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.88rem', cursor: 'pointer', outline: 'none' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>

          <button className="btn btn-outline btn-sm" onClick={() => setShowFilter(v => !v)}>
            <SlidersHorizontal size={14} /> Bộ lọc
            {hasFilters && <span className="badge badge-featured" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>!</span>}
          </button>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearAll}>
              <X size={14} /> Xóa lọc
            </button>
          )}
        </div>

        {/* Info - no per-page at top */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tìm thấy <strong style={{ color: 'var(--text-primary)' }}>{pagination.total}</strong> sản phẩm
            {pagination.totalPages > 1 && (
              <span> · Trang <strong style={{ color: 'var(--text-primary)' }}>{page}</strong>/{pagination.totalPages}</span>
            )}
          </div>
        </div>

        <div className="shop-layout">
          {/* ─── FILTER SIDEBAR ─────────────────────────── */}
          <aside className="filter-sidebar" style={{ display: showFilter || window.innerWidth >= 1024 ? 'block' : 'none' }}>

            {/* Category */}
            <div className="filter-group">
              <div className="filter-title">Danh mục</div>
              {visibleCats.map(cat => (
                <label key={cat.id} className="filter-option" style={{ fontWeight: category === String(cat.id) ? 700 : 500, color: category === String(cat.id) ? 'var(--accent)' : undefined, cursor: 'pointer' }}>
                  <input type="checkbox" checked={category === String(cat.id)} onChange={() => setParam('category', category === String(cat.id) ? '' : cat.id)} />
                  {cat.name}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.product_count}</span>
                </label>
              ))}
              {parentCats.length > 5 && (
                <button
                  onClick={() => setShowAllCats(v => !v)}
                  style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}
                >
                  {showAllCats ? <><ChevronUp size={13} /> Ẩn bớt</> : <><ChevronDown size={13} /> Xem thêm ({parentCats.length - 5})</>}
                </button>
              )}
            </div>

            {/* Brand */}
            <div className="filter-group">
              <div className="filter-title">Thương hiệu</div>
              {visibleBrands.map(b => (
                <label key={b.id} className="filter-option">
                  <input type="checkbox" checked={selectedBrands.includes(String(b.id))} onChange={() => toggleBrand(b.id)} />
                  {b.name}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.product_count}</span>
                </label>
              ))}
              {sortedBrands.length > 5 && (
                <button
                  onClick={() => setShowAllBrands(v => !v)}
                  style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}
                >
                  {showAllBrands ? <><ChevronUp size={13} /> Ẩn bớt</> : <><ChevronDown size={13} /> Xem thêm ({sortedBrands.length - 5})</>}
                </button>
              )}
            </div>

            {/* Price */}
            <div className="filter-group">
              <div className="filter-title">Khoảng giá</div>
              <div className="price-range">
                <input className="form-control" placeholder="Từ" value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" />
                <input className="form-control" placeholder="Đến"  value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" />
              </div>
              <button className="btn btn-outline btn-sm btn-full" style={{ marginTop: 8 }} onClick={applyPriceFilter}>
                Áp dụng
              </button>
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { label: 'Dưới 5tr',  min: '', max: 5000000 },
                  { label: '5-20tr',    min: 5000000, max: 20000000 },
                  { label: '20-50tr',   min: 20000000, max: 50000000 },
                  { label: 'Trên 50tr', min: 50000000, max: '' },
                ].map(p => (
                  <button key={p.label}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); applyPriceFilter(); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ─── PRODUCTS ───────────────────────────────── */}
          <div>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <div className="empty-state__title">Không tìm thấy sản phẩm</div>
                <div className="empty-state__desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={clearAll}>Xóa bộ lọc</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      wishlistIds={wishlistIds}
                      onWishlistToggle={(id, added) => {
                        setWishlistIds(prev =>
                          added ? [...prev, id] : prev.filter(x => x !== id)
                        );
                      }}
                    />
                  ))}
                </div>

                {/* ─── PAGINATION + PER PAGE BAR ─── */}
                <div style={{
                  marginTop: 28,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                  padding: '12px 16px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                }}>

                  {/* ── Page buttons ── */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                    {/* « Prev */}
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                      style={{
                        minWidth: 34, height: 34, borderRadius: 6, padding: '0 10px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-2)',
                        color: page <= 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                        cursor: page <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s', opacity: page <= 1 ? 0.45 : 1,
                      }}
                    >«</button>

                    {/* Page numbers */}
                    {buildPageNums().map((pg, idx) =>
                      pg === '…' ? (
                        <span key={`ell-${idx}`} style={{
                          minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text-muted)', fontSize: '0.85rem', userSelect: 'none',
                        }}>…</span>
                      ) : (
                        <button
                          key={pg}
                          onClick={() => goToPage(pg)}
                          style={{
                            minWidth: 34, height: 34, borderRadius: 6,
                            border: '1.5px solid',
                            borderColor: pg === page ? 'var(--accent)' : 'var(--border)',
                            background: pg === page ? 'var(--accent)' : 'var(--surface-2)',
                            color: pg === page ? '#fff' : 'var(--text-primary)',
                            fontWeight: pg === page ? 700 : 500,
                            cursor: 'pointer', fontSize: '0.85rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                            boxShadow: pg === page ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                          }}
                        >{pg}</button>
                      )
                    )}

                    {/* » Next */}
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= pagination.totalPages}
                      style={{
                        minWidth: 34, height: 34, borderRadius: 6, padding: '0 10px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-2)',
                        color: page >= pagination.totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
                        cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s', opacity: page >= pagination.totalPages ? 0.45 : 1,
                      }}
                    >»</button>
                  </div>

                  {/* ── Show Per Page ── */}
                  <div ref={perPageRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>Show Per Page</span>
                    <button
                      onClick={() => setShowPerPage(v => !v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 6,
                        border: `1.5px solid ${showPerPage ? 'var(--accent)' : 'var(--border)'}`,
                        background: 'var(--surface-2)', color: 'var(--text-primary)',
                        fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                        minWidth: 58, justifyContent: 'space-between',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      {limit}
                      <ChevronDown size={13} style={{ transform: showPerPage ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s', color: 'var(--text-muted)' }} />
                    </button>

                    {showPerPage && (
                      <div style={{
                        position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
                        background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                        borderRadius: 8, overflow: 'hidden', zIndex: 50,
                        minWidth: 80, boxShadow: 'var(--shadow-lg)',
                      }}>
                        {PER_PAGE_OPTIONS.map(n => (
                          <button key={n}
                            onClick={() => { setParam('limit', n); goToPage(1); setShowPerPage(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              width: '100%', padding: '9px 16px',
                              border: 'none', cursor: 'pointer',
                              background: limit === n ? 'var(--accent-light)' : 'transparent',
                              color: limit === n ? 'var(--accent)' : 'var(--text-primary)',
                              fontSize: '0.88rem', fontWeight: limit === n ? 700 : 400,
                              transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => { if (limit !== n) e.currentTarget.style.background = 'var(--surface-3)'; }}
                            onMouseLeave={e => { if (limit !== n) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {n}
                            {limit === n && <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
