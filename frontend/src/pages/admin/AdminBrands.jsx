import { useState, useEffect } from 'react';
import { Plus, Pencil, X, Tag } from 'lucide-react';
import { adminApi, brandApi } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', country: '' };

export default function AdminBrands() {
  const [brands,    setBrands]    = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);

  const load = () => brandApi.getAll().then(r => setBrands(r.data.data || []));
  useEffect(() => { document.title = 'Thương hiệu – Admin'; load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({ name: b.name, description: b.description || '', country: b.country || '' });
    setEditId(b.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Tên thương hiệu không được để trống!'); return; }
    setSaving(true);
    try {
      if (editId) {
        await adminApi.updateBrand(editId, form);
        toast.success('Cập nhật thương hiệu thành công!');
      } else {
        await adminApi.createBrand(form);
        toast.success('Thêm thương hiệu thành công!');
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🏷️ Thương hiệu</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <Plus size={14} /> Thêm thương hiệu
        </button>
      </div>

      <div className="card"><div className="card-body" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th>Slug</th>
              <th>Quốc gia</th>
              <th>Mô tả</th>
              <th>Số SP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Chưa có thương hiệu nào</td></tr>
            ) : brands.map(b => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>#{b.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 700 }}>{b.name}</span>
                  </div>
                </td>
                <td><code style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.slug}</code></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{b.country || '—'}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.description || '—'}
                </td>
                <td style={{ fontWeight: 600 }}>{b.product_count || 0}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)} title="Chỉnh sửa">
                    <Pencil size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">{editId ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body" style={{ display: 'grid', gap: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tên thương hiệu *</label>
                  <input
                    className="form-control"
                    required
                    placeholder="Ví dụ: ASUS, Dell, Apple..."
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Quốc gia</label>
                  <input
                    className="form-control"
                    placeholder="Ví dụ: Đài Loan, Mỹ, Hàn Quốc..."
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Mô tả</label>
                  <input
                    className="form-control"
                    placeholder="Mô tả ngắn về thương hiệu..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
