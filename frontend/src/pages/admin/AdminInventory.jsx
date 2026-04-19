import { useState, useEffect } from 'react';
import { Plus, X, PackageOpen } from 'lucide-react';
import { adminApi, productApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);

const TYPE_LABEL = { import:'Nhập hàng', export:'Xuất hàng', adjustment:'Điều chỉnh', damage:'Hỏng hóc' };
const TYPE_COLOR = { import:'var(--emerald)', export:'var(--amber)', adjustment:'var(--accent)', damage:'var(--red)' };

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [logs,     setLogs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showModal,setShowModal]= useState(false);
  const [form, setForm] = useState({ product_id:'', quantity_change:0, type:'import', note:'' });
  const [tab, setTab] = useState('low_stock'); // low_stock | logs

  const loadLogs = () => adminApi.getInventoryLogs().then(r => setLogs(r.data.data));

  useEffect(() => {
    document.title='Kho hàng – Admin';
    Promise.all([
      productApi.getAll({ limit: 100 }),
      adminApi.getInventoryLogs(),
    ]).then(([pr, lr]) => {
      setProducts(pr.data.data);
      setLogs(lr.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await adminApi.importInventory(form);
      toast.success('Nhập/xuất kho thành công!');
      setShowModal(false); loadLogs();
      productApi.getAll({limit:100}).then(r=>setProducts(r.data.data));
    } catch (err) { toast.error(err.response?.data?.message||'Lỗi!'); }
  };

  const lowStock = products.filter(p => p.stock_quantity <= (p.min_stock_alert||5));
  const outOfStock = products.filter(p => p.stock_quantity === 0);

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">📦 Quản lý kho hàng</h1>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>
          <Plus size={14}/> Nhập/Xuất kho
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{marginBottom:20}}>
        {[
          {label:'Tổng sản phẩm',  v:products.length,      cls:'icon-blue'},
          {label:'Hết hàng',        v:outOfStock.length,    cls:'icon-red'},
          {label:'Sp sắp hết',      v:lowStock.length,      cls:'icon-amber'},
          {label:'Giao dịch kho',   v:logs.length,          cls:'icon-green'},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className={`stat-card__icon ${s.cls}`}><PackageOpen size={18}/></div>
            <div>
              <div className="stat-card__value">{s.v}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{marginBottom:16}}>
        <div className={`tab ${tab==='low_stock'?'active':''}`} onClick={()=>setTab('low_stock')}>
          ⚠️ Sản phẩm sắp hết hàng ({lowStock.length})
        </div>
        <div className={`tab ${tab==='logs'?'active':''}`} onClick={()=>setTab('logs')}>
          📋 Lịch sử kho ({logs.length})
        </div>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : tab==='low_stock' ? (
          <table className="data-table">
            <thead><tr><th>Sản phẩm</th><th>Tồn kho</th><th>Cảnh báo</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {lowStock.length===0
                ? <tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'var(--emerald)'}}>✅ Tất cả sản phẩm đều còn hàng!</td></tr>
                : lowStock.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <img src={p.thumbnail} alt="" style={{width:40,height:30,objectFit:'cover',borderRadius:6}} onError={e=>{e.target.src='https://placehold.co/40x30/1E293B/3B82F6?text=IMG';}}/>
                      <span style={{fontWeight:600,fontSize:'0.88rem'}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{fontWeight:800,color:p.stock_quantity===0?'var(--red)':'var(--amber)',fontSize:'1.1rem'}}>{p.stock_quantity}</td>
                  <td style={{color:'var(--text-muted)'}}>{p.min_stock_alert||5}</td>
                  <td><span className={`badge ${p.stock_quantity===0?'badge-cancelled':'badge-pending'}`}>{p.stock_quantity===0?'Hết hàng':'Sắp hết'}</span></td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={()=>{setForm(f=>({...f,product_id:p.id,type:'import'}));setShowModal(true);}}>
                      Nhập hàng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead><tr><th>Sản phẩm</th><th>Loại</th><th>Thay đổi</th><th>Trước</th><th>Sau</th><th>Ghi chú</th><th>Ngày</th></tr></thead>
            <tbody>
              {logs.map(l=>(
                <tr key={l.id}>
                  <td style={{fontSize:'0.85rem',fontWeight:600}}>{l.product_name}</td>
                  <td><span style={{color:TYPE_COLOR[l.type],fontWeight:600,fontSize:'0.8rem'}}>{TYPE_LABEL[l.type]||l.type}</span></td>
                  <td style={{fontWeight:700,color:l.quantity_change>0?'var(--emerald)':'var(--red)'}}>{l.quantity_change>0?`+${l.quantity_change}`:l.quantity_change}</td>
                  <td style={{color:'var(--text-muted)'}}>{l.stock_before}</td>
                  <td style={{fontWeight:600}}>{l.stock_after}</td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.note||'—'}</td>
                  <td style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{new Date(l.created_at).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">Nhập/Xuất kho</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleImport}>
              <div className="modal__body" style={{display:'grid',gap:14}}>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Sản phẩm *</label>
                  <select className="form-control" value={form.product_id} onChange={e=>setForm(f=>({...f,product_id:e.target.value}))} required>
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p=><option key={p.id} value={p.id}>{p.name} (Tồn: {p.stock_quantity})</option>)}
                  </select>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Loại giao dịch</label>
                  <select className="form-control" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    <option value="import">Nhập hàng (+)</option>
                    <option value="export">Xuất hàng (-)</option>
                    <option value="adjustment">Điều chỉnh</option>
                    <option value="damage">Hàng hỏng (-)</option>
                  </select>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Số lượng *</label>
                  <input className="form-control" type="number" required value={form.quantity_change}
                    onChange={e=>setForm(f=>({...f,quantity_change:parseInt(e.target.value)||0}))}
                    placeholder={form.type==='import'?'Số lượng nhập (dương)':'Số lượng (dương, hệ thống tự xử lý)'}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Ghi chú</label>
                  <input className="form-control" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Lý do nhập/xuất..."/>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
