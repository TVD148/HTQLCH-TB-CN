import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);
const STATUS_CLASSES = {pending:'badge-pending',confirmed:'badge-confirmed',shipping:'badge-shipping',delivered:'badge-delivered',cancelled:'badge-cancelled'};
const STATUS_LABELS  = {pending:'Chờ xác nhận',confirmed:'Đã xác nhận',shipping:'Đang giao',delivered:'Đã giao',cancelled:'Đã hủy',refunded:'Hoàn tiền'};
const ALL_STATUSES   = Object.keys(STATUS_LABELS);

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState('');
  const [search,  setSearch]  = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.getOrders({ status, search }).then(r => setOrders(r.data.data)).finally(()=>setLoading(false));
  };

  useEffect(() => { document.title='Đơn hàng – Admin'; load(); }, [status]);

  const handleStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      load();
    } catch { toast.error('Có lỗi xảy ra!'); } finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="admin-topbar"><h1 className="admin-title">📦 Quản lý đơn hàng</h1></div>

      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input className="form-control" style={{maxWidth:300}} placeholder="Tìm mã đơn, tên KH..."
          value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} />
        <select className="form-control" style={{maxWidth:180}} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {ALL_STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={load}>Tìm kiếm</button>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
          <table className="data-table">
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th>Ngày đặt</th><th>Hành động</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id}>
                  <td style={{fontWeight:700}}>{o.order_code}</td>
                  <td>
                    <div style={{fontWeight:600}}>{o.customer_name}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{o.receiver_phone}</div>
                  </td>
                  <td style={{color:'var(--accent)',fontWeight:700}}>{fmt(o.total_amount)}</td>
                  <td><span style={{fontSize:'0.78rem',color:o.payment_status==='paid'?'var(--emerald)':'var(--amber)'}}>{o.payment_status==='paid'?'Đã TT':'Chưa TT'}</span></td>
                  <td><span className={`badge ${STATUS_CLASSES[o.status]||''}`}>{STATUS_LABELS[o.status]||o.status}</span></td>
                  <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <select value={o.status} onChange={e=>handleStatus(o.id,e.target.value)} disabled={!!updating}
                      style={{background:'var(--surface-3)',border:'1px solid var(--border)',borderRadius:6,padding:'4px 8px',color:'var(--text-primary)',fontSize:'0.78rem',cursor:'pointer'}}>
                      {ALL_STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
}
