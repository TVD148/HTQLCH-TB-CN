import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderApi } from '../api';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);

const STATUS_MAP = {
  cho_xac_nhan: { label: 'Chờ xác nhận', cls: 'badge-pending' },
  da_xac_nhan:  { label: 'Đã xác nhận', cls: 'badge-confirmed' },
  dang_giao:    { label: 'Đang giao',    cls: 'badge-shipping' },
  da_giao:      { label: 'Đã giao',      cls: 'badge-delivered' },
  da_huy:       { label: 'Đã hủy',       cls: 'badge-cancelled' },
  hoan_tien:    { label: 'Hoàn tiền',    cls: 'badge-cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Đơn hàng của tôi – TechStore';
    orderApi.getAll().then(r => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="section"><div className="container">
      <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:28}}>📦 Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} style={{opacity:.3}}/>
          <div className="empty-state__title">Chưa có đơn hàng nào</div>
          <Link to="/shop" className="btn btn-primary" style={{marginTop:16}}>Mua sắm ngay</Link>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {orders.map(o=>(
            <Link key={o.id} to={`/orders/${o.order_code}`} style={{display:'flex',alignItems:'center',gap:16,padding:16,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',transition:'border-color .2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <Package size={20} style={{color:'var(--accent)',flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'0.9rem'}}>{o.order_code}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>
                  {new Date(o.created_at).toLocaleDateString('vi-VN')} · {o.item_count} sản phẩm
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700,color:'var(--accent)'}}>{fmt(o.total_amount)}</div>
                <span className={`badge ${STATUS_MAP[o.status]?.cls || ''}`}>{STATUS_MAP[o.status]?.label || o.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></div>
  );
}
