import { useState, useEffect, useRef } from 'react';
import { Zap, Plus, Trash2, Clock, Search, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);
const fmtDT = d => d ? new Date(d).toLocaleString('vi-VN') : '—';
const toInput = d => { if (!d) return ''; const dt = new Date(d); return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const pct = (orig, flash) => (orig && flash && flash < orig) ? Math.round((1 - flash / orig) * 100) : null;

const getStatus = (sale) => {
  const now = Date.now();
  if (!sale.is_active) return { label: 'Tắt', color: '#6b7280' };
  if (now < new Date(sale.start_time)) return { label: 'Sắp diễn ra', color: '#f59e0b' };
  if (now > new Date(sale.end_time))   return { label: 'Đã kết thúc', color: '#ef4444' };
  return { label: 'Đang chạy', color: '#22c55e' };
};

// ── Inline Edit Form ────────────────────────────────────────────
function EditForm({ sale, onSave, onCancel }) {
  const [form, setForm] = useState({ name: sale.name, start_time: toInput(sale.start_time), end_time: toInput(sale.end_time) });
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 10 }}>
      <input className="form-control" style={{ flex: '2 1 140px', fontSize: '0.82rem' }}
        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tên" />
      <input className="form-control" type="datetime-local" style={{ flex: '1 1 160px', fontSize: '0.82rem' }}
        value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
      <input className="form-control" type="datetime-local" style={{ flex: '1 1 160px', fontSize: '0.82rem' }}
        value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
      <button className="btn btn-primary btn-sm" onClick={() => onSave(form)}><Check size={13} /></button>
      <button className="btn btn-ghost btn-sm" onClick={onCancel}><X size={13} /></button>
    </div>
  );
}

export default function AdminFlashSale() {
  const [sales, setSales]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [products, setProducts]     = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch]         = useState('');
  const [showDrop, setShowDrop]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSale, setNewSale]       = useState({ name: 'Flash Sale', start_time: '', end_time: '' });
  const [pendingProduct, setPendingProduct] = useState(null);
  const [editingId, setEditingId]   = useState(null);

  const dropRef   = useRef(null);
  const searchRef = useRef(null);

  const loadSales = async () => {
    try { const r = await axios.get(`${API}/admin/flash-sale`, getAuth()); setSales(r.data.data || []); }
    catch { toast.error('Lỗi tải flash sale'); }
  };
  const loadProducts = async (id) => {
    setLoading(true);
    try { const r = await axios.get(`${API}/admin/flash-sale/${id}/products`, getAuth()); setProducts(r.data.data || []); }
    catch { toast.error('Lỗi tải sản phẩm'); }
    finally { setLoading(false); }
  };
  const loadAllProducts = async () => {
    try { const r = await axios.get(`${API}/products?limit=200&sort=newest`); setAllProducts(r.data.data || []); }
    catch {}
  };

  useEffect(() => { loadSales(); loadAllProducts(); }, []);
  useEffect(() => { if (selected) loadProducts(selected.id); }, [selected]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = e => { if (!dropRef.current?.contains(e.target) && !searchRef.current?.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/admin/flash-sale`, newSale, getAuth());
      toast.success('Đã tạo Flash Sale!');
      setShowNewForm(false);
      setNewSale({ name: 'Flash Sale', start_time: '', end_time: '' });
      await loadSales();
      setSelected({ ...newSale, id: r.data.data.id });
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi tạo flash sale'); }
  };

  const handleSaveEdit = async (sale, form) => {
    try {
      await axios.put(`${API}/admin/flash-sale/${sale.id}`, { ...sale, ...form, is_active: sale.is_active }, getAuth());
      toast.success('Đã cập nhật!');
      setEditingId(null);
      loadSales();
      if (selected?.id === sale.id) setSelected(s => ({ ...s, ...form }));
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const handleToggle = async (sale) => {
    try {
      await axios.put(`${API}/admin/flash-sale/${sale.id}`, { name: sale.name, start_time: sale.start_time, end_time: sale.end_time, is_active: !sale.is_active }, getAuth());
      toast.success(sale.is_active ? 'Đã tắt' : 'Đã bật');
      loadSales();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const handleDelete = async (sale) => {
    if (!window.confirm(`Xóa Flash Sale "${sale.name}"? Không thể hoàn tác!`)) return;
    try {
      await axios.delete(`${API}/admin/flash-sale/${sale.id}`, getAuth());
      toast.success('Đã xóa flash sale');
      if (selected?.id === sale.id) setSelected(null);
      loadSales();
    } catch { toast.error('Lỗi xóa'); }
  };

  const handleAddProduct = async () => {
    if (!pendingProduct) { toast.error('Chọn sản phẩm trước'); return; }
    const flashPrice = pendingProduct.sale_price || pendingProduct.price;
    try {
      await axios.post(`${API}/admin/flash-sale/${selected.id}/products`, { product_id: pendingProduct.id, flash_price: parseFloat(flashPrice) }, getAuth());
      toast.success('Đã thêm sản phẩm!');
      setPendingProduct(null); setSearch('');
      loadProducts(selected.id);
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thêm sản phẩm'); }
  };

  const handleRemove = async (pid) => {
    if (!window.confirm('Xóa sản phẩm này khỏi flash sale?')) return;
    try {
      await axios.delete(`${API}/admin/flash-sale/${selected.id}/products/${pid}`, getAuth());
      toast.success('Đã xóa'); loadProducts(selected.id);
    } catch { toast.error('Lỗi xóa'); }
  };

  const filteredAll = allProducts.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) &&
    !products.find(fp => fp.product_id === p.id)
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={22} color="var(--amber)" /> Quản lý Flash Sale
        </h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNewForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Tạo Flash Sale mới
        </button>
      </div>

      {/* Form tạo mới */}
      {showNewForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.95rem' }}>Tạo chương trình Flash Sale</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                <label className="form-label">Tên chương trình</label>
                <input className="form-control" value={newSale.name} onChange={e => setNewSale({ ...newSale, name: e.target.value })} required />
              </div>
              <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                <label className="form-label">Bắt đầu</label>
                <input className="form-control" type="datetime-local" value={newSale.start_time} onChange={e => setNewSale({ ...newSale, start_time: e.target.value })} required />
              </div>
              <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                <label className="form-label">Kết thúc</label>
                <input className="form-control" type="datetime-local" value={newSale.end_time} onChange={e => setNewSale({ ...newSale, end_time: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm">Tạo</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowNewForm(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: 20 }}>
        {/* Danh sách Flash Sale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sales.length === 0
            ? <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có flash sale nào</div>
            : sales.map(sale => {
              const st = getStatus(sale);
              const isEditing = editingId === sale.id;
              return (
                <div key={sale.id} className="card"
                  style={{ cursor: 'pointer', border: selected?.id === sale.id ? '2px solid var(--accent)' : '2px solid var(--border)' }}
                  onClick={() => !isEditing && setSelected(sale)}>
                  <div className="card-body" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{sale.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                          {fmtDT(sale.start_time)} → {fmtDT(sale.end_time)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sale.product_count} sản phẩm</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: `${st.color}22`, color: st.color }}>
                          {st.label}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {/* Bật/Tắt */}
                          <button onClick={e => { e.stopPropagation(); handleToggle(sale); }}
                            className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                            {sale.is_active ? 'Tắt' : 'Bật'}
                          </button>
                          {/* Sửa */}
                          <button onClick={e => { e.stopPropagation(); setEditingId(isEditing ? null : sale.id); }}
                            className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', color: 'var(--accent)' }}>
                            <Edit2 size={12} />
                          </button>
                          {/* Xóa */}
                          <button onClick={e => { e.stopPropagation(); handleDelete(sale); }}
                            className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', color: 'var(--red)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Form sửa inline */}
                    {isEditing && (
                      <div onClick={e => e.stopPropagation()}>
                        <EditForm sale={sale}
                          onSave={form => handleSaveEdit(sale, form)}
                          onCancel={() => setEditingId(null)} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Chi tiết Flash Sale */}
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Sản phẩm trong: {selected.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Đóng</button>
            </div>

            {/* Thêm sản phẩm */}
            <div className="card card--dropdown" style={{ marginBottom: 14 }}>
              <div className="card-body" style={{ overflow: 'visible' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>Thêm sản phẩm vào Flash Sale</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Search nổi */}
                  <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      <input ref={searchRef} className="form-control" style={{ paddingLeft: 32 }}
                        placeholder="Gõ tên sản phẩm để tìm..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setShowDrop(true); setPendingProduct(null); }}
                        onFocus={() => setShowDrop(true)} />
                    </div>
                    {showDrop && search && filteredAll.length > 0 && (
                      <div ref={dropRef} style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        zIndex: 9999, background: 'var(--surface-1)',
                        border: '1px solid var(--border)', borderRadius: 10,
                        boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                        maxHeight: 300, overflowY: 'auto',
                      }}>
                        {filteredAll.slice(0, 12).map(p => {
                          const fp = p.sale_price || p.price;
                          const d = pct(p.price, fp);
                          return (
                            <div key={p.id}
                              onClick={() => { setPendingProduct(p); setSearch(p.name); setShowDrop(false); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              {p.thumbnail && <img src={p.thumbnail} alt="" style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
                                  <span style={{ textDecoration: 'line-through' }}>{fmt(p.price)}</span>
                                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{fmt(fp)}</span>
                                  {d && <span style={{ background: '#ef444422', color: '#ef4444', borderRadius: 4, padding: '0 5px', fontWeight: 700 }}>-{d}%</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filteredAll.length > 12 && (
                          <div style={{ padding: '8px 14px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Còn {filteredAll.length - 12} sản phẩm khác...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {pendingProduct && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)', flex: '1 1 180px' }}>
                      {pendingProduct.thumbnail && <img src={pendingProduct.thumbnail} alt="" style={{ width: 30, height: 30, borderRadius: 4, objectFit: 'cover' }} />}
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{pendingProduct.name}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--amber)', fontWeight: 700 }}>
                          {fmt(pendingProduct.sale_price || pendingProduct.price)}
                          {pct(pendingProduct.price, pendingProduct.sale_price || pendingProduct.price) && (
                            <span style={{ marginLeft: 5, color: '#ef4444' }}>(-{pct(pendingProduct.price, pendingProduct.sale_price || pendingProduct.price)}%)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="button" className="btn btn-primary btn-sm"
                    onClick={handleAddProduct} disabled={!pendingProduct}
                    style={{ alignSelf: 'flex-end', opacity: pendingProduct ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Plus size={14} /> Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Bảng sản phẩm */}
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)' }}>
                      {['Sản phẩm', 'Giá gốc', 'Giá KM', 'Giá Flash', 'Giảm', ''].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</td></tr>
                    ) : products.map(p => {
                      const d = pct(p.original_price, p.flash_price);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {p.thumbnail && <img src={p.thumbnail} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />}
                              <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{p.product_name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}><s>{fmt(p.original_price)}</s></td>
                          <td style={{ padding: '10px 12px', fontSize: '0.82rem' }}>{fmt(p.sale_price)}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem' }}>{fmt(p.flash_price)}</td>
                          <td style={{ padding: '10px 12px', fontSize: '0.82rem' }}>
                            {d ? <span style={{ background: '#ef444422', color: '#ef4444', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>-{d}%</span> : '—'}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <button onClick={() => handleRemove(p.product_id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '4px 8px' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
