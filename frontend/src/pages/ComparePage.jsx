import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, ShoppingCart, Trash2, Plus, X, Star } from 'lucide-react';
import { productApi } from '../api';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

/* ── Hiển thị sao ── */
function Stars({ rating }) {
  const r = Math.round(rating || 0);
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14}
          fill={s <= r ? 'var(--amber)' : 'none'}
          color={s <= r ? 'var(--amber)' : 'var(--surface-3)'}
        />
      ))}
    </div>
  );
}

export default function ComparePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();

  const [products, setProducts] = useState([]);   // full product detail from API
  const [loading, setLoading] = useState(false);
  const [allSpecs, setAllSpecs] = useState([]);

  /* Mỗi khi compareList thay đổi, fetch chi tiết sản phẩm */
  useEffect(() => {
    document.title = 'So sánh sản phẩm – TechStore';
    if (!compareList.length) { setProducts([]); setAllSpecs([]); return; }
    setLoading(true);
    Promise.all(compareList.map(p => productApi.getBySlug(p.slug).catch(() => null)))
      .then(results => {
        const valid = results.filter(Boolean).map(r => r.data.data);
        setProducts(valid);
        const specNames = [...new Set(valid.flatMap(p => (p.specs || []).map(s => s.spec_name)))];
        setAllSpecs(specNames);
      })
      .finally(() => setLoading(false));
  }, [compareList]);

  /* ── Empty state ── */
  if (!compareList.length) return (
    <div className="section"><div className="container">
      <div className="empty-state">
        <BarChart2 size={56} style={{ opacity: .25 }} />
        <div className="empty-state__title">Chưa có sản phẩm nào để so sánh</div>
        <div className="empty-state__desc">
          Nhấn nút <strong>⊞ So sánh</strong> trên thẻ sản phẩm để thêm sản phẩm vào đây.<br />
          Tối đa <strong>3 sản phẩm</strong> cùng một lúc.
        </div>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>
          <Plus size={16} /> Chọn sản phẩm
        </Link>
      </div>
    </div></div>
  );

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const COLS = 1 + products.length;

  /* ── CSS ── */
  const labelCell = {
    padding: '14px 18px',
    borderBottom: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    fontWeight: 700,
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    background: 'var(--surface-2)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 160,
  };
  const dataCell = {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: '0.88rem',
  };
  const sectionHead = {
    padding: '10px 18px',
    background: 'linear-gradient(135deg,var(--accent) 0%,var(--accent-dark,#1d4ed8) 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.78rem',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  };

  /* ══ Tính giá trị highlight (cao nhất/thấp nhất) ══ */
  const prices  = products.map(p => p.sale_price || p.price);
  const minPrice = Math.min(...prices);
  const maxRating = Math.max(...products.map(p => p.avg_rating || 0));

  return (
    <div className="section"><div className="container">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <BarChart2 size={22} color="var(--accent)" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          So sánh sản phẩm
          <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
            ({products.length}/3)
          </span>
        </h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {compareList.length < 3 && (
            <Link to="/shop" className="btn btn-outline btn-sm">
              <Plus size={14} /> Thêm sản phẩm
            </Link>
          )}
          <button className="btn btn-ghost btn-sm" onClick={clearCompare}
            style={{ color: 'var(--red)' }}>
            <Trash2 size={14} /> Xóa tất cả
          </button>
        </div>
      </div>

      {/* ── Bảng so sánh ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 560 }}>
            <colgroup>
              <col style={{ width: 160 }} />
              {products.map((_, i) => <col key={i} />)}
              {/* Slot trống nếu < 3 */}
              {compareList.length < 3 && <col />}
            </colgroup>
            <tbody>

              {/* ══ ROW: Hình ảnh + tên ══ */}
              <tr>
                <td style={labelCell}>Sản phẩm</td>
                {products.map(p => (
                  <td key={p.id} style={{ ...dataCell, padding: '20px 16px', background: 'var(--surface-1)' }}>
                    {/* Nút xóa */}
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      style={{
                        position: 'relative', float: 'right',
                        background: 'var(--surface-3)', border: 'none', borderRadius: '50%',
                        width: 26, height: 26, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                      }}
                      title="Xóa khỏi so sánh"
                    >
                      <X size={13} />
                    </button>

                    <Link to={`/shop/${p.slug}`}>
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        style={{ width: '100%', maxWidth: 180, height: 148, objectFit: 'contain', borderRadius: 10, margin: '0 auto 12px', display: 'block' }}
                        onError={e => { e.target.src = 'https://placehold.co/180x148/1E293B/3B82F6?text=Tech'; }}
                      />
                    </Link>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                      {p.brand_name}
                    </div>
                    <Link to={`/shop/${p.slug}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3, display: 'block' }}>
                      {p.name}
                    </Link>
                  </td>
                ))}

                {/* Slot thêm sản phẩm */}
                {compareList.length < 3 && (
                  <td style={{ ...dataCell, opacity: 0.5 }}>
                    <Link to="/shop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--text-muted)', textDecoration: 'none', padding: '32px 0' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={22} />
                      </div>
                      <span style={{ fontSize: '0.82rem' }}>Thêm sản phẩm</span>
                    </Link>
                  </td>
                )}
              </tr>

              {/* ══ ROW: Mô tả ══ */}
              <tr>
                <td style={labelCell}>Mô tả</td>
                {products.map(p => (
                  <td key={p.id} style={{ ...dataCell, textAlign: 'left', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {p.short_desc || p.description?.slice(0, 120) || '—'}
                  </td>
                ))}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ ROW: Giá ══ */}
              <tr>
                <td style={labelCell}>Giá bán</td>
                {products.map(p => {
                  const price = p.sale_price || p.price;
                  const isBest = price === minPrice;
                  return (
                    <td key={p.id} style={{ ...dataCell, background: isBest ? 'rgba(16,185,129,0.06)' : undefined }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isBest ? 'var(--emerald)' : 'var(--accent)' }}>
                        {fmt(price)}
                      </div>
                      {p.sale_price && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {fmt(p.price)}
                        </div>
                      )}
                      {isBest && products.length > 1 && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 700, marginTop: 4 }}>
                          🏆 Giá tốt nhất
                        </div>
                      )}
                    </td>
                  );
                })}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ ROW: Còn hàng ══ */}
              <tr>
                <td style={labelCell}>Tình trạng</td>
                {products.map(p => (
                  <td key={p.id} style={dataCell}>
                    {p.stock_quantity > 0
                      ? <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>✅ Còn hàng</span>
                      : <span style={{ color: 'var(--red)', fontWeight: 600 }}>❌ Hết hàng</span>}
                  </td>
                ))}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ ROW: Đánh giá ══ */}
              <tr>
                <td style={labelCell}>Đánh giá</td>
                {products.map(p => {
                  const isBest = (p.avg_rating || 0) === maxRating && maxRating > 0;
                  return (
                    <td key={p.id} style={{ ...dataCell, background: isBest && products.length > 1 ? 'rgba(251,191,36,0.06)' : undefined }}>
                      <Stars rating={p.avg_rating} />
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {p.avg_rating ? `${Number(p.avg_rating).toFixed(1)}/5` : 'Chưa có'}
                      </div>
                    </td>
                  );
                })}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ ROW: Thêm vào giỏ ══ */}
              <tr>
                <td style={labelCell}>Thêm vào giỏ</td>
                {products.map(p => (
                  <td key={p.id} style={dataCell}>
                    <button
                      className={`btn btn-sm ${p.stock_quantity > 0 ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ width: '100%', maxWidth: 160 }}
                      disabled={p.stock_quantity === 0}
                      onClick={async () => {
                        try { await addToCart(p.id); toast.success('Đã thêm vào giỏ!'); }
                        catch { toast.error('Không thể thêm!'); }
                      }}
                    >
                      <ShoppingCart size={13} />
                      {p.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                    <Link to={`/shop/${p.slug}`} className="btn btn-ghost btn-sm"
                      style={{ width: '100%', maxWidth: 160, marginTop: 6, justifyContent: 'center' }}>
                      Xem chi tiết
                    </Link>
                  </td>
                ))}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ ROW: Xóa ══ */}
              <tr>
                <td style={labelCell}>Xóa</td>
                {products.map(p => (
                  <td key={p.id} style={dataCell}>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--red)' }}
                      title="Xóa khỏi so sánh"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                ))}
                {compareList.length < 3 && <td style={dataCell} />}
              </tr>

              {/* ══ THÔNG SỐ KỸ THUẬT ══ */}
              {allSpecs.length > 0 && (
                <>
                  <tr>
                    <td colSpan={COLS + (compareList.length < 3 ? 1 : 0)} style={sectionHead}>
                      ⚙️ Thông số kỹ thuật
                    </td>
                  </tr>
                  {allSpecs.map(specName => {
                    const vals = products.map(p => {
                      const sp = p.specs?.find(s => s.spec_name === specName);
                      return sp ? `${sp.spec_value}${sp.unit ? ' ' + sp.unit : ''}` : '—';
                    });
                    const allSame = vals.every(v => v === vals[0]);
                    return (
                      <tr key={specName}>
                        <td style={{ ...labelCell, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>
                          {specName}
                        </td>
                        {vals.map((v, i) => (
                          <td key={i} style={{
                            ...dataCell,
                            background: !allSame && v !== '—' ? 'rgba(59,130,246,0.05)' : undefined,
                            fontWeight: !allSame && v !== '—' ? 700 : 400,
                          }}>
                            {v}
                          </td>
                        ))}
                        {compareList.length < 3 && <td style={dataCell} />}
                      </tr>
                    );
                  })}
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div></div>
  );
}
