import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Tag, Search } from 'lucide-react';
import { adminApi, brandApi } from '../../api';
import toast from 'react-hot-toast';

const genSlug = (name) => name.toLowerCase()
  .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g,'a').replace(/[èéẻẽẹêềếểễệ]/g,'e')
  .replace(/[ìíỉĩị]/g,'i').replace(/[òóỏõọôồốổỗộơờớởỡợ]/g,'o')
  .replace(/[ùúủũụưừứửữự]/g,'u').replace(/[ỳýỷỹỵ]/g,'y').replace(/đ/g,'d')
  .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();

const emptyForm = { name: '', slug: '', description: '', country: '' };

export default function AdminBrands() {
  const [brands,    setBrands]    = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState('');

  const load = () => brandApi.getAll().then(r => setBrands(r.data.data || []));
  useEffect(() => { document.title = 'Thương hiệu – Admin'; load(); }, []);

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({ name: b.name, slug: b.slug||'', description: b.description||'', country: b.country||'' });
    setEditId(b.id); setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa thương hiệu "${name}"?`)) return;
    try {
      await adminApi.deleteBrand(id);
      toast.success('Đã xóa thương hiệu!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Không thể xóa!'); }
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
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally { setSaving(false); }
  };

  // Lọc theo search
  const filtered = brands.filter(b =>
    !search.trim() || b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🏷️ Thương hiệu</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <Plus size={14} /> Thêm thương hiệu
        </button>
      </div>

      {/* Search */}
      <div style={{marginBottom:16}}>
        <div style={{position:'relative',maxWidth:400}}>
          <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
          <input className="form-control" style={{paddingLeft:32}} placeholder="Tìm tên thương hiệu..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
          {search && (
            <button onClick={()=>setSearch('')}
              style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',padding:2,display:'flex',alignItems:'center'}}
            >×</button>
          )}
        </div>
      </div>

      <div className="card"><div className="card-body" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Slug</th>
              <th>Quốc gia</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                {search ? 'Không tìm thấy thương hiệu nào' : 'Chưa có thương hiệu nào'}
              </td></tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
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
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)} title="Chỉnh sửa">
                      <Pencil size={13} />
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{color:'var(--red)'}} onClick={() => handleDelete(b.id, b.name)} title="Xóa">
                      <Trash2 size={13} />
                    </button>
                  </div>
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
                    className="form-control" required
                    placeholder="Ví dụ: ASUS, Dell, Apple..."
                    value={form.name}
                    onChange={e => {
                      const val = e.target.value;
                      setForm(f => ({ ...f, name: val, ...(!editId && { slug: genSlug(val) }) }));
                    }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>Slug {!editId && <span style={{fontSize:'0.72rem',color:'var(--accent)',fontWeight:500}}>✨ Tự động tạo</span>}</span>
                    <button type="button" onClick={()=>setForm(f=>({...f,slug:genSlug(f.name)}))}
                      style={{fontSize:'0.72rem',background:'none',border:'none',color:'var(--accent)',cursor:'pointer',padding:0,fontWeight:600}}>
                      🔄 Tạo lại
                    </button>
                  </label>
                  <input className="form-control" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} placeholder="ten-thuong-hieu"/>
                  {form.slug && <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:4}}>
                    🔗 /shop?brand=<strong style={{color:'var(--accent)'}}>{form.slug}</strong>
                  </div>}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Quốc gia</label>
                  <input className="form-control" placeholder="Ví dụ: Đài Loan, Mỹ, Hàn Quốc..."
                    value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}/>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Mô tả</label>
                  <input className="form-control" placeholder="Mô tả ngắn về thương hiệu..."
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
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
