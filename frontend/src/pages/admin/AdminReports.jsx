import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { adminApi } from '../../api';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);
const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(n||0);

// Simple bar chart built with CSS — no external lib needed
function BarChart({ data, valueKey='revenue', labelKey='date', color='var(--accent)' }) {
  if (!data?.length) return <div style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>Không có dữ liệu</div>;
  const max = Math.max(...data.map(d => d[valueKey]||0));
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:6,height:180,padding:'0 4px'}}>
      {data.map((d, i) => {
        const pct = max > 0 ? ((d[valueKey]||0)/max)*100 : 0;
        return (
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{fontSize:'0.62rem',color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',maxWidth:'100%',textOverflow:'ellipsis'}}>
              {fmt(d[valueKey]||0).replace('₫','').trim()}
            </div>
            <div style={{width:'100%',background:'var(--surface-3)',borderRadius:4,overflow:'hidden',height:140,display:'flex',alignItems:'flex-end'}}>
              <div style={{width:'100%',height:`${pct}%`,background:color,borderRadius:4,minHeight:2,transition:'height .3s ease'}}/>
            </div>
            <div style={{fontSize:'0.65rem',color:'var(--text-muted)',textAlign:'center'}}>
              {d[labelKey]?.substring?.(5)||d[labelKey]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReports() {
  const [data,    setData]    = useState(null);
  const [daily,   setDaily]   = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [period,  setPeriod]  = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Báo cáo – Admin';
    Promise.all([
      adminApi.dashboard(),
      adminApi.revenueReport({ period: 'daily',   days: 14 }),
      adminApi.revenueReport({ period: 'monthly', months: 6 }),
    ]).then(([dashRes, dailyRes, monthRes]) => {
      setData(dashRes.data.data);
      setDaily(dailyRes.data.data||[]);
      setMonthly(monthRes.data.data||[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  const d = data || {};
  const chartData = period==='daily' ? daily : monthly;
  const chartKey  = period==='daily' ? 'date'  : 'month';

  const totalRevenue = monthly.reduce((s,m) => s + (m.revenue||0), 0);
  const totalOrders  = monthly.reduce((s,m) => s + (m.orders||0), 0);

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">📊 Báo cáo & Thống kê</h1>
        <span style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>
          <Calendar size={14} style={{marginRight:4}}/>
          {new Date().toLocaleDateString('vi-VN',{month:'long',year:'numeric'})}
        </span>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{marginBottom:24}}>
        {[
          {label:'Doanh thu hôm nay',  v:fmt(d.today?.revenue_today),   sub:`${fmtNum(d.today?.orders_today)} đơn`,  cls:'icon-blue'},
          {label:'Doanh thu tháng này',v:fmt(d.this_month?.revenue_month),sub:`${fmtNum(d.this_month?.orders_month)} đơn`,cls:'icon-green'},
          {label:'Tổng doanh thu (6T)', v:fmt(totalRevenue),             sub:`${fmtNum(totalOrders)} đơn`,            cls:'icon-amber'},
          {label:'Sản phẩm bán chạy',  v:`${d.products?.total_products||0} SP`,sub:`${d.products?.out_of_stock||0} hết hàng`,cls:'icon-red'},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className={`stat-card__icon ${s.cls}`}><TrendingUp size={18}/></div>
            <div>
              <div className="stat-card__value" style={{fontSize:'1.1rem'}}>{s.v}</div>
              <div className="stat-card__label">{s.label}</div>
              {s.sub && <div style={{fontSize:'0.72rem',color:'var(--emerald)',marginTop:2}}>{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{fontWeight:700}}>Doanh thu theo thời gian</h3>
            <div style={{display:'flex',gap:6}}>
              {[{k:'daily',l:'14 ngày qua'},{k:'monthly',l:'6 tháng qua'}].map(b=>(
                <button key={b.k} className={`btn btn-sm ${period===b.k?'btn-primary':'btn-ghost'}`} onClick={()=>setPeriod(b.k)}>
                  {b.l}
                </button>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <>
              <BarChart data={chartData} valueKey="revenue" labelKey={chartKey} />
              {/* Table below chart */}
              <div style={{marginTop:20,overflowX:'auto'}}>
                <table className="data-table">
                  <thead><tr><th>Ngày/Tháng</th><th>Số đơn</th><th>Doanh thu</th><th>TB/đơn</th></tr></thead>
                  <tbody>
                    {chartData.slice().reverse().map((row,i)=>(
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{row[chartKey]}</td>
                        <td>{fmtNum(row.orders)}</td>
                        <td style={{color:'var(--accent)',fontWeight:700}}>{fmt(row.revenue)}</td>
                        <td style={{color:'var(--text-muted)'}}>{row.orders>0?fmt(Math.round(row.revenue/row.orders)):'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Chưa có dữ liệu doanh thu</div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      {d.recent_orders?.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h3 style={{fontWeight:700,marginBottom:16}}>Đơn hàng gần đây</h3>
            <table className="data-table">
              <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày</th></tr></thead>
              <tbody>
                {d.recent_orders.map(o=>(
                  <tr key={o.id}>
                    <td style={{fontWeight:600}}>{o.order_code}</td>
                    <td>{o.customer_name}</td>
                    <td style={{color:'var(--accent)',fontWeight:600}}>{fmt(o.total_amount)}</td>
                    <td><span className={`badge badge-${o.status}` }>{o.status}</span></td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
