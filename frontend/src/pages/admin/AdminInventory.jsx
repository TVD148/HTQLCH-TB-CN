import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, X, PackageOpen, Search } from 'lucide-react';
import { adminApi, productApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const TYPE_LABEL = { import: 'Nhập hàng', export: 'Xuất hàng', adjustment: 'Điều chỉnh', damage: 'Hỏng hóc' };
const TYPE_COLOR = { import: 'var(--emerald)', export: 'var(--amber)', adjustment: 'var(--accent)', damage: 'var(--red)' };

export default function AdminInventory() {
  const [products,  setProducts]  = useState([]);
  const [logs,      setLogs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product_id: '', quantity_change: 0, type: 'import', note: '' });
  const [tab, setTab]   = useState('products'); // products | out_of_stock | low_stock | logs

  // Search state for "Sản phẩm" tab
  const [search, setSearch]     = useState('');
  const [filtered, setFiltered] = useState([]);
  const debounceRef = useRef(null);

  const loadAll = useCallback(() => {
    return Promise.all([
      productApi.getAll({ limit: 200 }),
      adminApi.getInventoryLogs(),
    ]).then(([pr, lr]) => {
      setProducts(pr.data.data);
      setFiltered(pr.data.data);
      setLogs(lr.data.data);
    });
  }, []);

  useEffect(() => {
    document.title = 'Kho hàng – Admin';
    setLoading(true);
    loadAll().finally(() => setLoading(false));
  }, []);

  // Debounced client-side search for "Sản phẩm" tab
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = val.trim().toLowerCase();
      setFiltered(q ? products.filter(p => p.name.toLowerCase().includes(q) || p.category_name?.toLowerCase().includes(q) || p.brand_name?.toLowerCase().includes(q)) : products);
    }, 300);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await adminApi.importInventory(form);
      toast.success('Nhập/xuất kho thành công!');
      setShowModal(false);
      setForm({ product_id: '', quantity_change: 0, type: 'import', note: '' });
      setLoading(true);
      loadAll().finally(() => setLoading(false));
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi!'); }
  };

  // Phân tách rõ ràng: hết hàng (=0) và sắp hết (>0 nhưng <= alert)
  const outOfStock = products.filter(p => p.stock_quantity === 0);
  const lowStock   = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.min_stock_alert || 5));

  // Reusable product row for import button
  const ImportBtn = ({ p }) => (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => { setForm(f => ({ ...f, product_id: p.id, type: 'import', note: '' })); setShowModal(true); }}
    >
      Nhập hàng
    </button>
  );

  const TABS = [
    { k: 'products',     label: `📦 Tất cả SP (${products.length})` },
    { k: 'out_of_stock', label: `🚫 Hết hàng (${outOfStock.length})` },
    { k: 'low_stock',    label: `⚠️ Sắp hết (${lowStock.length})` },
    { k: 'logs',         label: `📋 Lịch sử (${logs.length})` },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">📦 Quản lý kho hàng</h1>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Tổng sản phẩm', v: products.length, cls: 'icon-blue' },
          { label: 'Hết hàng',       v: outOfStock.length, cls: 'icon-red' },
          { label: 'Sắp hết hàng',   v: lowStock.length,   cls: 'icon-amber' },
          { label: 'Giao dịch kho',  v: logs.length,       cls: 'icon-green' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__icon ${s.cls}`}><PackageOpen size={18} /></div>
            <div>
              <div className="stat-card__value">{s.v}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {TABS.map(t => (
          <div key={t.k} className={`tab ${tab === t.k ? 'active' : ''}`} onClick={() => setTab(t.k)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Search bar — chỉ hiện ở tab Sản phẩm */}
      {tab === 'products' && (
        <div style={{ position: 'relative', maxWidth: 380, marginBottom: 14 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: 32 }}
            placeholder="Tìm theo tên, danh mục, thương hiệu..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      )}

      <div className="card"><div className="card-body" style={{ padding: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : tab === 'products' ? (
          /* ── TAB: TẤT CẢ SẢN PHẨM ── */
          <table className="data-table">
            <thead><tr>
              <th>Sản phẩm</th><th>Danh mục</th><th>Thương hiệu</th>
              <th style={{ textAlign: 'center' }}>Tồn kho</th>
              <th style={{ textAlign: 'center' }}>Cảnh báo</th>
              <th>Trạng thái</th><th>Giá</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm</td></tr>
                : filtered.map(p => {
                    const isOut = p.stock_quantity === 0;
                    const isLow = p.stock_quantity > 0 && p.stock_quantity <= (p.min_stock_alert || 5);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={p.thumbnail} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 6 }}
                              onError={e => { e.target.src = 'https://placehold.co/40x30/1E293B/3B82F6?text=IMG'; }} />
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.category_name || '—'}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.brand_name || '—'}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: isOut ? 'var(--red)' : isLow ? 'var(--amber)' : 'var(--emerald)' }}>
                          {p.stock_quantity}
                        </td>
                        <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.min_stock_alert || 5}</td>
                        <td>
                          {isOut
                            ? <span className="badge badge-cancelled">Hết hàng</span>
                            : isLow
                              ? <span className="badge badge-pending">Sắp hết</span>
                              : <span className="badge badge-delivered">Còn hàng</span>}
                        </td>
                        <td style={{ fontSize: '0.82rem' }}>{fmt(p.sale_price || p.price)}</td>
                        <td><ImportBtn p={p} /></td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

        ) : tab === 'out_of_stock' ? (
          /* ── TAB: HẾT HÀNG ── */
          <table className="data-table">
            <thead><tr><th>Sản phẩm</th><th>Tồn kho</th><th>Mức cảnh báo</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {outOfStock.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--emerald)' }}>✅ Không có sản phẩm nào hết hàng!</td></tr>
                : outOfStock.map(p => (
                  <tr key={p.id} style={{ background: 'rgba(239,68,68,0.04)' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.thumbnail} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 6 }}
                          onError={e => { e.target.src = 'https://placehold.co/40x30/1E293B/3B82F6?text=IMG'; }} />
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--red)', fontSize: '1.1rem' }}>0</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.min_stock_alert || 5}</td>
                    <td><span className="badge badge-cancelled">Hết hàng</span></td>
                    <td><ImportBtn p={p} /></td>
                  </tr>
                ))}
            </tbody>
          </table>

        ) : tab === 'low_stock' ? (
          /* ── TAB: SẮP HẾT (>0 nhưng <= alert) ── */
          <table className="data-table">
            <thead><tr><th>Sản phẩm</th><th>Tồn kho</th><th>Mức cảnh báo</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {lowStock.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--emerald)' }}>✅ Không có sản phẩm nào sắp hết!</td></tr>
                : lowStock.map(p => (
                  <tr key={p.id} style={{ background: 'rgba(245,158,11,0.04)' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.thumbnail} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 6 }}
                          onError={e => { e.target.src = 'https://placehold.co/40x30/1E293B/3B82F6?text=IMG'; }} />
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--amber)', fontSize: '1.1rem' }}>{p.stock_quantity}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.min_stock_alert || 5}</td>
                    <td><span className="badge badge-pending">Sắp hết</span></td>
                    <td><ImportBtn p={p} /></td>
                  </tr>
                ))}
            </tbody>
          </table>

        ) : (
          /* ── TAB: LỊCH SỬ KHO ── */
          <table className="data-table">
            <thead><tr>
              <th>Sản phẩm</th><th>Loại</th><th>Thay đổi</th>
              <th>Trước</th><th>Sau</th><th>Ghi chú</th><th>Ngày</th>
            </tr></thead>
            <tbody>
              {logs.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Chưa có giao dịch kho nào</td></tr>
                : logs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.product_name}</td>
                    <td><span style={{ color: TYPE_COLOR[l.type], fontWeight: 600, fontSize: '0.8rem' }}>{TYPE_LABEL[l.type] || l.type}</span></td>
                    <td style={{ fontWeight: 700, color: l.quantity_change > 0 ? 'var(--emerald)' : 'var(--red)' }}>
                      {l.quantity_change > 0 ? `+${l.quantity_change}` : l.quantity_change}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{l.stock_before}</td>
                    <td style={{ fontWeight: 600 }}>{l.stock_after}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.note || <span style={{ fontStyle: 'italic' }}>—</span>}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(l.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div></div>

      {/* ── Modal Nhập/Xuất kho ── */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">Nhập/Xuất kho</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleImport}>
              <div className="modal__body" style={{ display: 'grid', gap: 14 }}>
                {/* Sản phẩm */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sản phẩm *</label>
                  <select className="form-control" value={form.product_id}
                    onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} required>
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Tồn: {p.stock_quantity})</option>
                    ))}
                  </select>
                </div>

                {/* Loại giao dịch */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Loại giao dịch</label>
                  <select className="form-control" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="import">Nhập hàng (+)</option>
                    <option value="export">Xuất hàng (–)</option>
                    <option value="adjustment">Điều chỉnh</option>
                    <option value="damage">Hàng hỏng (–)</option>
                  </select>
                </div>

                {/* Số lượng */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Số lượng *</label>
                  <input className="form-control" type="number" min={1} required
                    value={form.quantity_change}
                    onChange={e => setForm(f => ({ ...f, quantity_change: parseInt(e.target.value) || 0 }))}
                    placeholder={form.type === 'import' ? 'Số lượng nhập (dương)' : 'Số lượng (hệ thống tự xử lý dấu)'} />
                </div>

                {/* Ghi chú */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="Nhập lý do, nguồn hàng, số hóa đơn... (tùy chọn)"
                    style={{ resize: 'vertical', minHeight: 72 }}
                  />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
