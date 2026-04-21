import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { productApi, categoryApi, brandApi } from '../api';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { val: 'newest',     label: 'Mới nhất' },
  { val: 'popular',   label: 'Phổ biến nhất' },
  { val: 'price_asc',  label: 'Giá tăng dần' },
  { val: 'price_desc', label: 'Giá giảm dần' },
  { val: 'rating',     label: 'Đánh giá cao nhất' },
];

const PER_PAGE_OPTIONS = [12, 20, 24, 48];

// Top 10 popular brands to show by default
const TOP_BRANDS = ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'LG', 'Logitech', 'Razer'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const [showAllCats,   setShowAllCats]   = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Filter state from URL
  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = parseInt(searchParams.get('page') || '1');
  const limit    = parseInt(searchParams.get('limit') || '20');
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
  const visibleBrands = showAllBrands ? sortedBrands : sortedBrands.slice(0, 10);

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

  return (
    <div className="section">
      <div className="container">
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, flex: 1 }}>
            {search ? `Kết quả: "${search}"` : featured ? '⭐ Sản phẩm nổi bật' : 'Tất cả sản phẩm'}
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

        {/* Info + Per Page */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tìm thấy <strong style={{ color: 'var(--text-primary)' }}>{pagination.total}</strong> sản phẩm
            {pagination.totalPages > 1 && (
              <span> · Trang <strong style={{ color: 'var(--text-primary)' }}>{page}</strong>/{pagination.totalPages}</span>
            )}
          </div>
          {/* Per page selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Hiển thị:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {PER_PAGE_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => { setParam('limit', n); setParam('page', 1); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: limit === n ? 'var(--accent)' : 'var(--border)',
                    background: limit === n ? 'var(--accent)' : 'var(--surface-2)',
                    color: limit === n ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: limit === n ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <span>/ trang</span>
          </div>
        </div>

        <div className="shop-layout">
          {/* ─── FILTER SIDEBAR ─────────────────────────── */}
          <aside className="filter-sidebar" style={{ display: showFilter || window.innerWidth >= 1024 ? 'block' : 'none' }}>

            {/* Category */}
            <div className="filter-group">
              <div className="filter-title">Danh mục</div>
              {visibleCats.map(cat => (
                <div key={cat.id}>
                  <div
                    className="filter-option"
                    style={{ fontWeight: category === String(cat.id) ? 700 : 500, color: category === String(cat.id) ? 'var(--accent)' : undefined }}
                    onClick={() => setParam('category', category === String(cat.id) ? '' : cat.id)}
                  >
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: category === String(cat.id) ? 'var(--accent)' : 'var(--surface-3)', display: 'inline-block', flexShrink: 0, transition: 'background 0.15s' }} />
                    {cat.name}
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.product_count}</span>
                  </div>
                </div>
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
              {sortedBrands.length > 10 && (
                <button
                  onClick={() => setShowAllBrands(v => !v)}
                  style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}
                >
                  {showAllBrands ? <><ChevronUp size={13} /> Ẩn bớt</> : <><ChevronDown size={13} /> Xem thêm ({sortedBrands.length - 10})</>}
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

                {/* ─── PAGINATION ─── */}
                {pagination.totalPages > 1 && (
                  <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
                    {/* Left: page info */}
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      Trang <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> / {pagination.totalPages}
                      &nbsp;·&nbsp;
                      {pagination.total} sản phẩm
                    </div>

                    {/* Center: page buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {/* Prev */}
                      <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1}
                        style={{
                          width: 36, height: 36, borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: page <= 1 ? 'var(--surface-1)' : 'var(--surface-2)',
                          color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: page <= 1 ? 'not-allowed' : 'pointer',
                          fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >«</button>

                      {buildPageNums().map((p, idx) =>
                        p === '…' ? (
                          <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: 'var(--text-muted)', userSelect: 'none' }}>…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            style={{
                              width: 36, height: 36, borderRadius: 8,
                              border: '1px solid',
                              borderColor: p === page ? 'var(--accent)' : 'var(--border)',
                              background: p === page ? 'var(--accent)' : 'var(--surface-2)',
                              color: p === page ? '#fff' : 'var(--text-primary)',
                              fontWeight: p === page ? 700 : 400,
                              cursor: 'pointer',
                              fontSize: '0.88rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                              boxShadow: p === page ? '0 0 0 2px rgba(59,130,246,0.25)' : 'none',
                            }}
                          >
                            {p}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        style={{
                          width: 36, height: 36, borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: page >= pagination.totalPages ? 'var(--surface-1)' : 'var(--surface-2)',
                          color: page >= pagination.totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                          fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >»</button>
                    </div>

                    {/* Right: per page */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>Hiển thị:</span>
                      {PER_PAGE_OPTIONS.map(n => (
                        <button
                          key={n}
                          onClick={() => { setParam('limit', n); goToPage(1); }}
                          style={{
                            padding: '4px 10px', borderRadius: 6,
                            border: '1px solid',
                            borderColor: limit === n ? 'var(--accent)' : 'var(--border)',
                            background: limit === n ? 'var(--accent)' : 'var(--surface-2)',
                            color: limit === n ? '#fff' : 'var(--text-primary)',
                            fontSize: '0.82rem', cursor: 'pointer',
                            fontWeight: limit === n ? 700 : 400,
                            transition: 'all 0.15s',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                      <span>/ trang</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
