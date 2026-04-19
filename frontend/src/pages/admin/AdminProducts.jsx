import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { adminApi, categoryApi, brandApi, productApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);

const emptyForm = {
  name:'', slug:'', description:'', short_desc:'', price:'', sale_price:'',
  stock_quantity:0, min_stock_alert:5, category_id:'', brand_id:'',
  thumbnail:'', is_active:1, is_featured:0
};

const genSlug = (name) => name.toLowerCase()
  .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g,'a')
  .replace(/[èéẻẽẹêềếểễệ]/g,'e')
  .replace(/[ìíỉĩị]/g,'i')
  .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g,'o')
  .replace(/[ùúủũụưừứửữự]/g,'u')
  .replace(/[ỳýỷỹỵ]/g,'y')
  .replace(/đ/g,'d')
  .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [search,     setSearch]     = useState('');
  const [deleting,   setDeleting]   = useState(null);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);

  const load = (p=page) => {
    setLoading(true);
    productApi.getAll({ search, page: p, limit: 15 })
      .then(r => { setProducts(r.data.data); setTotal(r.data.pagination?.total||0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Sản phẩm – Admin';
    categoryApi.getAll().then(r => setCategories(r.data.data));
    brandApi.getAll().then(r => setBrands(r.data.data));
    load(1);
  }, []);

  const setF = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price)||0,
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: parseInt(form.stock_quantity)||0,
      };
      if (editId) { await adminApi.updateProduct(editId, payload); toast.success('Cập nhật sản phẩm thành công!'); }
      else        { await adminApi.createProduct(payload);          toast.success('Thêm sản phẩm thành công!'); }
      setShowModal(false); setForm(emptyForm); setEditId(null); load(1);
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra!'); }
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description||'', short_desc: p.short_desc||'',
      price: p.price, sale_price: p.sale_price||'', stock_quantity: p.stock_quantity,
      min_stock_alert: p.min_stock_alert||5, category_id: p.category_id||'',
      brand_id: p.brand_id||'', thumbnail: p.thumbnail||'', is_active: p.is_active, is_featured: p.is_featured,
    });
    setEditId(p.id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    setDeleting(id);
    try { await adminApi.deleteProduct(id); toast.success('Đã xóa sản phẩm!'); load(1); }
    catch (err) { toast.error(err.response?.data?.message || 'Không thể xóa!'); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">📦 Sản phẩm ({total})</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}>
          <Plus size={14}/> Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div style={{display:'flex',gap:10,marginBottom:16}}>
        <div style={{position:'relative',flex:1,maxWidth:360}}>
          <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
          <input className="form-control" style={{paddingLeft:32}} placeholder="Tìm tên sản phẩm..."
            value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load(1)}/>
        </div>
        <button className="btn btn-outline btn-sm" onClick={()=>load(1)}>Tìm</button>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
          <table className="data-table">
            <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Tồn kho</th><th>Danh mục</th><th>Nổi bật</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <img src={p.thumbnail} alt="" style={{width:44,height:33,objectFit:'cover',borderRadius:6,background:'var(--surface-3)'}}
                        onError={e=>{e.target.src='https://placehold.co/44x33/1E293B/3B82F6?text=IMG';}}/>
                      <div>
                        <div style={{fontWeight:600,fontSize:'0.85rem',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                        <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{p.brand_name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight:700,color:'var(--accent)',fontSize:'0.9rem'}}>{fmt(p.sale_price||p.price)}</div>
                    {p.sale_price && <div style={{fontSize:'0.75rem',textDecoration:'line-through',color:'var(--text-muted)'}}>{fmt(p.price)}</div>}
                  </td>
                  <td>
                    <span style={{color: p.stock_quantity===0?'var(--red)': p.stock_quantity<=p.min_stock_alert?'var(--amber)':'var(--emerald)',fontWeight:700}}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{p.category_name}</td>
                  <td>{p.is_featured ? '⭐' : '—'}</td>
                  <td><span className={`badge ${p.is_active?'badge-delivered':'badge-cancelled'}`}>{p.is_active?'Đang bán':'Ẩn'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(p)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost btn-sm" style={{color:'var(--red)'}} disabled={deleting===p.id} onClick={()=>handleDelete(p.id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal" style={{maxWidth:640,width:'95vw'}}>
            <div className="modal__header">
              <span className="modal__title">{editId?'Chỉnh sửa':'Thêm sản phẩm mới'}</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body" style={{display:'grid',gap:12,maxHeight:'70vh',overflowY:'auto'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Tên sản phẩm *</label>
                    <input className="form-control" required value={form.name}
                      onChange={e=>{setF('name',e.target.value);if(!editId)setF('slug',genSlug(e.target.value));}}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Slug</label>
                    <input className="form-control" value={form.slug} onChange={e=>setF('slug',e.target.value)}/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Giá gốc (đ) *</label>
                    <input className="form-control" type="number" required value={form.price} onChange={e=>setF('price',e.target.value)}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Giá khuyến mãi (đ)</label>
                    <input className="form-control" type="number" value={form.sale_price} onChange={e=>setF('sale_price',e.target.value)} placeholder="Để trống nếu không sale"/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Tồn kho</label>
                    <input className="form-control" type="number" value={form.stock_quantity} onChange={e=>setF('stock_quantity',e.target.value)}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Cảnh báo tồn</label>
                    <input className="form-control" type="number" value={form.min_stock_alert} onChange={e=>setF('min_stock_alert',e.target.value)}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Nổi bật</label>
                    <select className="form-control" value={form.is_featured} onChange={e=>setF('is_featured',parseInt(e.target.value))}>
                      <option value={0}>Không</option><option value={1}>Có</option>
                    </select>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Danh mục *</label>
                    <select className="form-control" value={form.category_id} onChange={e=>setF('category_id',e.target.value)} required>
                      <option value="">Chọn danh mục</option>
                      {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Thương hiệu *</label>
                    <select className="form-control" value={form.brand_id} onChange={e=>setF('brand_id',e.target.value)} required>
                      <option value="">Chọn thương hiệu</option>
                      {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">URL ảnh thumbnail</label>
                  <input className="form-control" value={form.thumbnail} onChange={e=>setF('thumbnail',e.target.value)} placeholder="https://..."/>
                  {form.thumbnail && <img src={form.thumbnail} alt="" style={{marginTop:8,width:80,height:60,objectFit:'cover',borderRadius:6}} onError={e=>e.target.style.display='none'}/>}
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Mô tả ngắn</label>
                  <input className="form-control" value={form.short_desc} onChange={e=>setF('short_desc',e.target.value)} placeholder="CPU | GPU | RAM | Màn hình"/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea className="form-control" rows={4} value={form.description} onChange={e=>setF('description',e.target.value)}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Hiển thị</label>
                  <select className="form-control" value={form.is_active} onChange={e=>setF('is_active',parseInt(e.target.value))}>
                    <option value={1}>Đang bán</option><option value={0}>Ẩn</option>
                  </select>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">{editId?'Cập nhật':'Thêm sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
