import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FolderOpen, Search } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const genSlug = (name) => name.toLowerCase()
  .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g,'a').replace(/[èéẻẽẹêềếểễệ]/g,'e')
  .replace(/[ìíỉĩị]/g,'i').replace(/[òóỏõọôồốổỗộơờớởỡợ]/g,'o')
  .replace(/[ùúủũụưừứửữự]/g,'u').replace(/[ỳýỷỹỵ]/g,'y').replace(/đ/g,'d')
  .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();

const emptyForm = { name:'', slug:'', description:'' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [search,     setSearch]     = useState('');

  const load = () => adminApi.getCategories().then(r => setCategories(r.data.data));
  useEffect(() => { document.title='Danh mục – Admin'; load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tự động tính sort_order theo thứ tự nhập (số lượng hiện tại + 1)
      const payload = { ...form, sort_order: categories.length + 1 };
      if (editId) { await adminApi.updateCategory(editId, payload); toast.success('Cập nhật danh mục!'); }
      else        { await adminApi.createCategory(payload);          toast.success('Thêm danh mục!'); }
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message||'Lỗi!'); }
  };

  const openEdit = (c) => {
    setForm({ name:c.name, slug:c.slug, description:c.description||'' });
    setEditId(c.id); setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Đã xóa danh mục!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Không thể xóa!'); }
  };

  // Lọc theo search
  const filtered = categories.filter(c =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🗂️ Danh mục</h1>
        <button className="btn btn-primary btn-sm" onClick={()=>{setForm(emptyForm);setEditId(null);setShowModal(true);}}>
          <Plus size={14}/> Thêm danh mục
        </button>
      </div>

      {/* Search */}
      <div style={{marginBottom:16}}>
        <div style={{position:'relative',maxWidth:400}}>
          <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
          <input className="form-control" style={{paddingLeft:32}} placeholder="Tìm tên danh mục..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
          {search && (
            <button onClick={()=>setSearch('')}
              style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',padding:2,display:'flex',alignItems:'center'}}
            >×</button>
          )}
        </div>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        <table className="data-table">
          <thead><tr><th>Tên danh mục</th><th>Slug</th><th>Mô tả</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>Không tìm thấy danh mục nào</td></tr>
            ) : filtered.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <FolderOpen size={14} style={{color:'var(--accent)'}}/>
                    <span style={{fontWeight:700}}>{cat.name}</span>
                  </div>
                </td>
                <td><code style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{cat.slug}</code></td>
                <td style={{color:'var(--text-muted)',fontSize:'0.83rem',maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cat.description||'—'}</td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(cat)}><Pencil size={13}/></button>
                    <button className="btn btn-ghost btn-sm" style={{color:'var(--red)'}} onClick={()=>handleDelete(cat.id,cat.name)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">{editId?'Chỉnh sửa danh mục':'Thêm danh mục'}</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body" style={{display:'grid',gap:12}}>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Tên danh mục *</label>
                  <input className="form-control" required value={form.name}
                    onChange={e=>{
                      const val = e.target.value;
                      setForm(f=>({...f, name:val, ...(!editId && {slug:genSlug(val)})}));
                    }}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>Slug {!editId && <span style={{fontSize:'0.72rem',color:'var(--accent)',fontWeight:500}}>✨ Tự động tạo</span>}</span>
                    <button type="button" onClick={()=>setForm(f=>({...f,slug:genSlug(f.name)}))}
                      style={{fontSize:'0.72rem',background:'none',border:'none',color:'var(--accent)',cursor:'pointer',padding:0,fontWeight:600}}>
                      🔄 Tạo lại
                    </button>
                  </label>
                  <input className="form-control" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} placeholder="ten-danh-muc"/>
                  {form.slug && <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:4}}>
                    🔗 /shop?category=<strong style={{color:'var(--accent)'}}>{form.slug}</strong>
                  </div>}
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Mô tả</label>
                  <input className="form-control" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">{editId?'Cập nhật':'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
