import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { adminApi } from '../../api';

const fmt = (p) => p ? new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p) : '0đ';
const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(n||0);

const STATUS_CLASSES = { pending:'badge-pending',confirmed:'badge-confirmed',shipping:'badge-shipping',delivered:'badge-delivered',cancelled:'badge-cancelled',refunded:'badge-cancelled' };
const STATUS_LABELS  = { pending:'Chờ xác nhận',confirmed:'Đã xác nhận',shipping:'Đang giao',delivered:'Đã giao',cancelled:'Đã hủy',refunded:'Hoàn tiền' };

export default function AdminDashboard() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard – Admin TechStore';
    adminApi.dashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;
  if (!data)   return <div>Không thể tải dữ liệu</div>;

  const stats = [
    { icon: <TrendingUp size={20}/>, label: 'Doanh thu hôm nay', value: fmt(data.today?.revenue_today), cls: 'icon-blue', sub: `${fmtNum(data.today?.orders_today)} đơn hàng` },
    { icon: <TrendingUp size={20}/>, label: 'Doanh thu tháng',   value: fmt(data.this_month?.revenue_month), cls: 'icon-green', sub: `${fmtNum(data.this_month?.orders_month)} đơn` },
    { icon: <Users size={20}/>,      label: 'Khách hàng',        value: fmtNum(data.users?.total_users), cls: 'icon-amber', sub: `+${data.users?.new_today||0} hôm nay` },
    { icon: <Package size={20}/>,    label: 'Sản phẩm',          value: fmtNum(data.products?.total_products), cls: 'icon-red', sub: `${data.products?.out_of_stock||0} hết hàng` },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">📊 Dashboard</h1>
        <span style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>
          {new Date().toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
              {s.sub && <div style={{fontSize:'0.72rem',color:'var(--emerald)',marginTop:2}}>{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {data.products?.out_of_stock > 0 && (
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'var(--red-light)',border:'1px solid var(--red)',borderRadius:'var(--radius-md)',marginBottom:20}}>
          <AlertTriangle size={16} color="var(--red)"/>
          <span style={{fontSize:'0.88rem',color:'var(--red)',fontWeight:600}}>
            Có {data.products.out_of_stock} sản phẩm hết hàng cần nhập thêm!
          </span>
          <Link to="/admin/inventory" style={{marginLeft:'auto',color:'var(--red)',fontSize:'0.82rem',fontWeight:600}}>Xem → </Link>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card">
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h3 style={{fontWeight:700}}>Đơn hàng gần đây</h3>
            <Link to="/admin/orders" style={{color:'var(--accent)',fontSize:'0.85rem',display:'flex',alignItems:'center',gap:4}}>Xem tất cả <ChevronRight size={14}/></Link>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày đặt</th>
            </tr></thead>
            <tbody>
              {(data.recent_orders || []).map(o => (
                <tr key={o.id}>
                  <td style={{fontWeight:600}}>{o.order_code}</td>
                  <td>{o.customer_name}</td>
                  <td style={{color:'var(--accent)',fontWeight:600}}>{fmt(o.total_amount)}</td>
                  <td><span className={`badge ${STATUS_CLASSES[o.status]||''}`}>{STATUS_LABELS[o.status]||o.status}</span></td>
                  <td style={{color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
