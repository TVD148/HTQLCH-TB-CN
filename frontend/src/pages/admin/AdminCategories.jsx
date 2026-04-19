import { useState, useEffect } from 'react';
import { Plus, Pencil, X, FolderOpen } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const genSlug = (name) => name.toLowerCase()
  .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g,'a').replace(/[èéẻẽẹêềếểễệ]/g,'e')
  .replace(/[ìíỉĩị]/g,'i').replace(/[òóỏõọôồốổỗộơờớởỡợ]/g,'o')
  .replace(/[ùúủũụưừứửữự]/g,'u').replace(/[ỳýỷỹỵ]/g,'y').replace(/đ/g,'d')
  .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();

const emptyForm = { name:'', slug:'', description:'', parent_id:'', sort_order:0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);

  const load = () => adminApi.getCategories().then(r => setCategories(r.data.data));
  useEffect(() => { document.title='Danh mục – Admin'; load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await adminApi.updateCategory(editId, form); toast.success('Cập nhật danh mục!'); }
      else        { await adminApi.createCategory(form);          toast.success('Thêm danh mục!'); }
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message||'Lỗi!'); }
  };

  const openEdit = (c) => {
    setForm({name:c.name, slug:c.slug, description:c.description||'', parent_id:c.parent_id||'', sort_order:c.sort_order||0});
    setEditId(c.id); setShowModal(true);
  };

  const parents = categories.filter(c => !c.parent_id);

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🗂️ Danh mục</h1>
        <button className="btn btn-primary btn-sm" onClick={()=>{setForm(emptyForm);setEditId(null);setShowModal(true);}}>
          <Plus size={14}/> Thêm danh mục
        </button>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        <table className="data-table">
          <thead><tr><th>Tên danh mục</th><th>Slug</th><th>Cha</th><th>SP</th><th>Thứ tự</th><th></th></tr></thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    {cat.parent_id && <span style={{width:16,height:16,borderLeft:'2px solid var(--border)',borderBottom:'2px solid var(--border)',display:'inline-block',marginRight:4,marginLeft:8}}/>}
                    <FolderOpen size={14} style={{color:cat.parent_id?'var(--text-muted)':'var(--accent)'}}/>
                    <span style={{fontWeight:cat.parent_id?400:700}}>{cat.name}</span>
                  </div>
                </td>
                <td><code style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{cat.slug}</code></td>
                <td style={{color:'var(--text-muted)',fontSize:'0.83rem'}}>{cat.parent_id ? categories.find(c=>c.id===cat.parent_id)?.name||'—' : <span style={{color:'var(--accent)',fontWeight:600}}>Gốc</span>}</td>
                <td style={{fontWeight:600}}>{cat.product_count||0}</td>
                <td style={{color:'var(--text-muted)'}}>{cat.sort_order}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={()=>openEdit(cat)}><Pencil size={13}/></button></td>
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
                    onChange={e=>{setForm(f=>({...f,name:e.target.value}));if(!editId)setForm(f=>({...f,slug:genSlug(e.target.value)}));}}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Slug</label>
                  <input className="form-control" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Danh mục cha (nếu có)</label>
                  <select className="form-control" value={form.parent_id} onChange={e=>setForm(f=>({...f,parent_id:e.target.value}))}>
                    <option value="">Không có (danh mục gốc)</option>
                    {parents.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Mô tả</label>
                  <input className="form-control" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Thứ tự sắp xếp</label>
                  <input className="form-control" type="number" value={form.sort_order} onChange={e=>setForm(f=>({...f,sort_order:parseInt(e.target.value)||0}))}/>
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
