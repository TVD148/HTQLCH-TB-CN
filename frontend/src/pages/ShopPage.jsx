import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { productApi, categoryApi, brandApi } from '../api';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { val: 'newest',     label: 'Mới nhất' },
  { val: 'popular',   label: 'Phổ biến nhất' },
  { val: 'price_asc',  label: 'Giá tăng dần' },
  { val: 'price_desc', label: 'Giá giảm dần' },
  { val: 'rating',     label: 'Đánh giá cao nhất' },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);

  // Filter state from URL
  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = parseInt(searchParams.get('page') || '1');
  const featured = searchParams.get('featured') || '';
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? searchParams.get('brand').split(',').filter(Boolean) : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  useEffect(() => {
    document.title = 'Shop – TechStore';
    categoryApi.getAll().then(r => setCategories(r.data.data));
    brandApi.getAll().then(r => setBrands(r.data.data));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, category, sort, page, limit: 12 };
      if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (featured) params.featured = featured;
      const res = await productApi.getAll(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch { }
    finally { setLoading(false); }
  }, [search, category, sort, page, selectedBrands, minPrice, maxPrice, featured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
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

        {/* Info */}
        <div style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Tìm thấy <strong style={{ color: 'var(--text-primary)' }}>{pagination.total}</strong> sản phẩm
        </div>

        <div className="shop-layout">
          {/* ─── FILTER SIDEBAR ─────────────────────────── */}
          <aside className={`filter-sidebar ${!showFilter ? '' : ''}`} style={{ display: showFilter || window.innerWidth >= 1024 ? 'block' : 'none' }}>
            {/* Category */}
            <div className="filter-group">
              <div className="filter-title">Danh mục</div>
              {parentCats.map(cat => (
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
            </div>

            {/* Brand */}
            <div className="filter-group">
              <div className="filter-title">Thương hiệu</div>
              {brands.map(b => (
                <label key={b.id} className="filter-option">
                  <input type="checkbox" checked={selectedBrands.includes(String(b.id))} onChange={() => toggleBrand(b.id)} />
                  {b.name}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.product_count}</span>
                </label>
              ))}
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
              {/* Quick price buttons */}
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
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button className="pagination__btn" disabled={page <= 1} onClick={() => setParam('page', page - 1)}>‹</button>
                    {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button key={p} className={`pagination__btn ${p === page ? 'active' : ''}`} onClick={() => setParam('page', p)}>{p}</button>
                      );
                    })}
                    <button className="pagination__btn" disabled={page >= pagination.totalPages} onClick={() => setParam('page', page + 1)}>›</button>
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
