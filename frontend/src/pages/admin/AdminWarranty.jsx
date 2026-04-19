import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, X } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  pending:    { label:'Chờ xử lý',   cls:'badge-pending'   },
  processing: { label:'Đang xử lý',  cls:'badge-confirmed' },
  resolved:   { label:'Đã giải quyết',cls:'badge-delivered' },
  rejected:   { label:'Từ chối',     cls:'badge-cancelled'  },
};

export default function AdminWarranty() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status:'processing', note:'' });

  const load = () => adminApi.getWarranty().then(r => setRequests(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { document.title='Bảo hành – Admin'; load(); }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateWarranty(selected.id, form);
      toast.success('Cập nhật trạng thái bảo hành!');
      setSelected(null); load();
    } catch (err) { toast.error(err.response?.data?.message||'Lỗi!'); }
  };

  return (
    <div>
      <div className="admin-topbar"><h1 className="admin-title">🛡️ Quản lý bảo hành</h1></div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {Object.entries(STATUS_MAP).map(([k,v])=>{
          const cnt = requests.filter(r=>r.status===k).length;
          return (
            <div key={k} className="card"><div className="card-body" style={{textAlign:'center',padding:'16px 12px'}}>
              <div style={{fontSize:'1.8rem',fontWeight:900,color:'var(--accent)'}}>{cnt}</div>
              <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{v.label}</div>
            </div></div>
          );
        })}
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
          requests.length===0
            ? <div className="empty-state"><Shield size={48} style={{opacity:.3}}/><div className="empty-state__title">Chưa có yêu cầu bảo hành</div></div>
            : (
              <table className="data-table">
                <thead><tr><th>Sản phẩm</th><th>Khách hàng</th><th>Lý do</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                  {requests.map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600,fontSize:'0.88rem'}}>{r.product_name}</td>
                      <td>
                        <div style={{fontSize:'0.85rem',fontWeight:600}}>{r.customer_name}</div>
                        <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{r.phone}</div>
                      </td>
                      <td style={{fontSize:'0.83rem',color:'var(--text-muted)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.issue_description}</td>
                      <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                      <td><span className={`badge ${STATUS_MAP[r.status]?.cls||''}`}>{STATUS_MAP[r.status]?.label||r.status}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={()=>{setSelected(r);setForm({status:r.status,note:r.admin_note||''});}}>
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        )}
      </div></div>

      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">Xử lý bảo hành #{selected.id}</span>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div className="modal__body" style={{display:'grid',gap:12}}>
              <div style={{background:'var(--surface-3)',borderRadius:8,padding:12}}>
                <div style={{fontSize:'0.85rem',fontWeight:700,marginBottom:6}}>{selected.product_name}</div>
                <div style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:4}}>Khách: {selected.customer_name}</div>
                <div style={{fontSize:'0.82rem',color:'var(--text-secondary)'}}>Lý do: {selected.issue_description}</div>
              </div>
              <form onSubmit={handleUpdate} style={{display:'grid',gap:12}}>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Cập nhật trạng thái</label>
                  <select className="form-control" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                    {Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Ghi chú cho khách</label>
                  <textarea className="form-control" rows={3} value={form.note}
                    onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Kết quả kiểm tra, thời gian xử lý..."/>
                </div>
                <div className="modal__footer" style={{padding:0}}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setSelected(null)}>Hủy</button>
                  <button type="submit" className="btn btn-primary btn-sm">Lưu xử lý</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
