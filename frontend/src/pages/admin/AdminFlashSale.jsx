import { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Edit2, Check, X, Search, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const fmtDT = d => d ? new Date(d).toLocaleString('vi-VN') : '—';

function toLocalInput(d) {
  if (!d) return '';
  const dt = new Date(d);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdminFlashSale() {
  const [sales, setSales]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [products, setProducts]   = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSale, setNewSale]     = useState({ name: 'Flash Sale', start_time: '', end_time: '' });
  const [addForm, setAddForm]     = useState({ product_id: '', flash_price: '', qty_limit: '' });

  const loadSales = async () => {
    try {
      const r = await axios.get(`${API}/admin/flash-sale`, getAuth());
      setSales(r.data.data || []);
    } catch { toast.error('Lỗi tải flash sale'); }
  };

  const loadProducts = async (id) => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/admin/flash-sale/${id}/products`, getAuth());
      setProducts(r.data.data || []);
    } catch { toast.error('Lỗi tải sản phẩm flash sale'); }
    finally { setLoading(false); }
  };

  const loadAllProducts = async () => {
    try {
      const r = await axios.get(`${API}/products?limit=200&sort=newest`);
      setAllProducts(r.data.data || []);
    } catch {}
  };

  useEffect(() => { loadSales(); loadAllProducts(); }, []);

  useEffect(() => {
    if (selected) loadProducts(selected.id);
  }, [selected]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/admin/flash-sale`, newSale, getAuth());
      toast.success('Đã tạo Flash Sale!');
      setShowNewForm(false);
      setNewSale({ name: 'Flash Sale', start_time: '', end_time: '' });
      loadSales();
      setSelected({ ...newSale, id: r.data.data.id });
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi tạo flash sale'); }
  };

  const handleToggleActive = async (sale) => {
    try {
      await axios.put(`${API}/admin/flash-sale/${sale.id}`, { ...sale, is_active: !sale.is_active }, getAuth());
      toast.success(sale.is_active ? 'Đã tắt Flash Sale' : 'Đã bật Flash Sale');
      loadSales();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!addForm.product_id || !addForm.flash_price) { toast.error('Vui lòng chọn sản phẩm và nhập giá'); return; }
    try {
      await axios.post(`${API}/admin/flash-sale/${selected.id}/products`, {
        product_id: parseInt(addForm.product_id),
        flash_price: parseFloat(addForm.flash_price),
        qty_limit: addForm.qty_limit ? parseInt(addForm.qty_limit) : undefined,
      }, getAuth());
      toast.success('Đã thêm sản phẩm!');
      setAddForm({ product_id: '', flash_price: '', qty_limit: '' });
      loadProducts(selected.id);
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thêm sản phẩm'); }
  };

  const handleRemove = async (pid) => {
    if (!confirm('Xóa sản phẩm này khỏi flash sale?')) return;
    try {
      await axios.delete(`${API}/admin/flash-sale/${selected.id}/products/${pid}`, getAuth());
      toast.success('Đã xóa');
      loadProducts(selected.id);
    } catch { toast.error('Lỗi xóa'); }
  };

  const filteredAll = allProducts.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) &&
    !products.find(fp => fp.product_id === p.id)
  );

  const getStatus = (sale) => {
    const now = Date.now();
    const start = new Date(sale.start_time);
    const end   = new Date(sale.end_time);
    if (!sale.is_active) return { label: 'Tắt', color: '#6b7280' };
    if (now < start)     return { label: 'Sắp diễn ra', color: '#f59e0b' };
    if (now > end)       return { label: 'Đã kết thúc', color: '#ef4444' };
    return { label: 'Đang chạy', color: '#22c55e' };
  };

  return (
    <div style={{ padding: 24 }}>
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
                <input className="form-control" value={newSale.name}
                  onChange={e => setNewSale({ ...newSale, name: e.target.value })} required />
              </div>
              <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                <label className="form-label">Bắt đầu</label>
                <input className="form-control" type="datetime-local" value={newSale.start_time}
                  onChange={e => setNewSale({ ...newSale, start_time: e.target.value })} required />
              </div>
              <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
                <label className="form-label">Kết thúc</label>
                <input className="form-control" type="datetime-local" value={newSale.end_time}
                  onChange={e => setNewSale({ ...newSale, end_time: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm">Tạo</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowNewForm(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '320px 1fr' : '1fr', gap: 20 }}>
        {/* Danh sách Flash Sale */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sales.length === 0 ? (
              <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có flash sale nào</div>
            ) : sales.map(sale => {
              const st = getStatus(sale);
              return (
                <div key={sale.id} onClick={() => setSelected(sale)}
                  className="card" style={{ cursor: 'pointer', border: selected?.id === sale.id ? '2px solid var(--accent)' : '2px solid var(--border)' }}>
                  <div className="card-body" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{sale.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                          <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                          {fmtDT(sale.start_time)} → {fmtDT(sale.end_time)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {sale.product_count} sản phẩm
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                          background: `${st.color}22`, color: st.color }}>
                          {st.label}
                        </span>
                        <button onClick={e => { e.stopPropagation(); handleToggleActive(sale); }}
                          className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          {sale.is_active ? 'Tắt' : 'Bật'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chi tiết Flash Sale */}
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Sản phẩm trong: {selected.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Đóng</button>
            </div>

            {/* Form thêm sản phẩm */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-body">
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>Thêm sản phẩm</div>
                <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ margin: 0, flex: '2 1 200px' }}>
                    <label className="form-label">Tìm sản phẩm</label>
                    <input className="form-control" placeholder="Gõ để tìm..." value={search}
                      onChange={e => setSearch(e.target.value)} />
                    {search && filteredAll.length > 0 && (
                      <div style={{ position: 'absolute', zIndex: 50, background: 'var(--surface-1)', border: '1px solid var(--border)',
                        borderRadius: 8, maxHeight: 200, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', minWidth: 280 }}>
                        {filteredAll.slice(0, 10).map(p => (
                          <div key={p.id} onClick={() => {
                            setAddForm(f => ({ ...f, product_id: p.id, flash_price: p.sale_price || p.price }));
                            setSearch(p.name);
                          }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.82rem',
                            borderBottom: '1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {p.name} — {fmt(p.sale_price || p.price)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group" style={{ margin: 0, flex: '1 1 130px', position: 'relative' }}>
                    <label className="form-label">Giá Flash (₫)</label>
                    <input className="form-control" type="number" placeholder="VD: 990000" value={addForm.flash_price}
                      onChange={e => setAddForm(f => ({ ...f, flash_price: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ margin: 0, flex: '1 1 100px' }}>
                    <label className="form-label">Giới hạn SL</label>
                    <input className="form-control" type="number" placeholder="Trống = ∞" value={addForm.qty_limit}
                      onChange={e => setAddForm(f => ({ ...f, qty_limit: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Thêm</button>
                </form>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)' }}>
                      {['Sản phẩm', 'Giá gốc', 'Giá KM', 'Giá Flash', 'Đã bán / Giới hạn', ''].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700,
                          color: 'var(--text-muted)', fontSize: '0.78rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</td></tr>
                    ) : products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {p.thumbnail && <img src={p.thumbnail} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />}
                            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{p.product_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          <s>{fmt(p.original_price)}</s>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem' }}>{fmt(p.sale_price)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem' }}>
                          {fmt(p.flash_price)}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {p.sold} / {p.qty_limit ?? '∞'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <button onClick={() => handleRemove(p.product_id)}
                            className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '4px 8px' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
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
