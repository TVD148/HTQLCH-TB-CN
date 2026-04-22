import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign, BarChart2, Package, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);
const fmtNum = n => new Intl.NumberFormat('vi-VN').format(n || 0);

const STATUS_MAP = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: '#f59e0b' },
  da_xac_nhan:  { label: 'Đã xác nhận',  color: '#3b82f6' },
  dang_giao:    { label: 'Đang giao',     color: '#8b5cf6' },
  da_giao:      { label: 'Đã giao',       color: '#22c55e' },
  da_huy:       { label: 'Đã hủy',        color: '#ef4444' },
};

// CSS Bar chart
function BarChart({ data, valueKey = 'revenue', labelKey = 'period', color = 'var(--accent)' }) {
  if (!data?.length) return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Chưa có dữ liệu</div>
  );
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, padding: '0 4px' }}>
      {data.map((d, i) => {
        const pct = ((d[valueKey] || 0) / max) * 100;
        return (
          <div key={i} title={`${d[labelKey]}: ${fmt(d[valueKey])}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: '100%', background: 'var(--surface-3)', borderRadius: 4, height: 130, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${Math.max(pct, 2)}%`,
                background: color, borderRadius: 4, transition: 'height .4s ease',
              }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {String(d[labelKey] || '').slice(-5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReports() {
  const today  = new Date();
  const defFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const defTo   = today.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(defFrom);
  const [toDate,   setToDate]   = useState(defTo);
  const [groupBy,  setGroupBy]  = useState('day');
  const [report,   setReport]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await axios.get(`${API}/admin/reports/revenue`, {
        ...getAuth(),
        params: { from: fromDate, to: toDate, group_by: groupBy },
      });
      setReport(r.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể tải báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Báo cáo – Admin';
    load();
  }, []);

  const s = report?.summary || {};
  const chart = report?.revenue_chart || [];
  const tops  = report?.top_products || [];
  const breakdown = report?.status_breakdown || [];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart2 size={22} color="var(--accent)" /> Báo cáo &amp; Thống kê
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={13} /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Bộ lọc thời gian */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Từ ngày</label>
            <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Đến ngày</label>
            <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nhóm theo</label>
            <select className="form-control" value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
          {/* Nhanh */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { label: 'Hôm nay',    from: defTo,   to: defTo,   g: 'day' },
              { label: '7 ngày',     from: new Date(today - 6*86400000).toISOString().slice(0,10), to: defTo, g: 'day' },
              { label: 'Tháng này',  from: defFrom,  to: defTo,   g: 'day' },
              { label: '6 tháng',    from: new Date(today.getFullYear(), today.getMonth()-5, 1).toISOString().slice(0,10), to: defTo, g: 'month' },
            ].map(p => (
              <button key={p.label} className="btn btn-ghost btn-sm"
                onClick={() => { setFromDate(p.from); setToDate(p.to); setGroupBy(p.g); }}>
                {p.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} /> Xem báo cáo
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444',
          borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
            {[
              { icon: <DollarSign size={18}/>, label: 'Tổng doanh thu', value: fmt(s.total_revenue), color: 'icon-blue' },
              { icon: <ShoppingBag size={18}/>, label: 'Số đơn hàng',   value: fmtNum(s.total_orders), color: 'icon-green' },
              { icon: <TrendingUp size={18}/>,  label: 'Trung bình/đơn', value: fmt(s.avg_order_value), color: 'icon-amber' },
              { icon: <Users size={18}/>,        label: 'Khách hàng',    value: fmtNum(s.unique_customers), color: 'icon-red' },
            ].map(c => (
              <div key={c.label} className="stat-card">
                <div className={`stat-card__icon ${c.color}`}>{c.icon}</div>
                <div>
                  <div className="stat-card__value" style={{ fontSize: '1.15rem' }}>{c.value}</div>
                  <div className="stat-card__label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                Biểu đồ doanh thu ({groupBy === 'day' ? 'theo ngày' : 'theo tháng'})
              </h3>
              <BarChart data={chart} valueKey="revenue" labelKey="period" />
              {chart.length > 0 && (
                <div style={{ marginTop: 20, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)' }}>
                        {['Thời gian', 'Số đơn', 'Doanh thu', 'TB/đơn'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...chart].reverse().map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.period}</td>
                          <td style={{ padding: '8px 12px' }}>{fmtNum(row.order_count)}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--accent)', fontWeight: 700 }}>{fmt(row.revenue)}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>
                            {row.order_count > 0 ? fmt(Math.round(row.revenue / row.order_count)) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: tops.length > 0 ? '1fr 1fr' : '1fr', gap: 20 }}>
            {/* Top sản phẩm */}
            {tops.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Package size={16} /> Top 10 sản phẩm bán chạy
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tops.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? 'var(--amber)' : 'var(--surface-3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800,
                          color: i < 3 ? '#000' : 'var(--text-muted)', flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        {p.thumbnail && <img src={p.thumbnail} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Đã bán: {fmtNum(p.total_sold)}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{fmt(p.total_revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Phân tích trạng thái đơn */}
            {breakdown.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Phân tích trạng thái đơn hàng</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {breakdown.map(b => {
                      const st = STATUS_MAP[b.status] || { label: b.status, color: 'var(--text-muted)' };
                      const total = breakdown.reduce((s, x) => s + (x.count || 0), 0);
                      const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                      return (
                        <div key={b.status}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, color: st.color }}>{st.label}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{fmtNum(b.count)} đơn ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: st.color, borderRadius: 3, transition: 'width .4s ease' }} />
                          </div>
                          {b.amount > 0 && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{fmt(b.amount)}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
