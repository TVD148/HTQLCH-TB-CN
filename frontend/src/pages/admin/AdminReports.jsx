import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, Package, BarChart2, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt    = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);
const fmtNum = n => new Intl.NumberFormat('vi-VN').format(n || 0);

const STATUS_MAP = {
  cho_xac_nhan: { label: 'Chờ xác nhận', color: '#f59e0b' },
  da_xac_nhan:  { label: 'Đã xác nhận',  color: '#3b82f6' },
  dang_giao:    { label: 'Đang giao',     color: '#8b5cf6' },
  da_giao:      { label: 'Đã giao',       color: '#22c55e' },
  da_huy:       { label: 'Đã hủy',        color: '#ef4444' },
  hoan_tien:    { label: 'Hoàn tiền',     color: '#f97316' },
};

const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
const QUARTERS = ['Quý 1 (T1–T3)','Quý 2 (T4–T6)','Quý 3 (T7–T9)','Quý 4 (T10–T12)'];
const MEDAL = ['🥇','🥈','🥉'];

// ── Grouped Bar Chart (2 cột mỗi kỳ: doanh thu + số đơn) ───────────────────
function GroupedBarChart({ data }) {
  if (!data?.length) return <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Chưa có dữ liệu</div>;

  const maxRev = Math.max(...data.map(d => d.revenue     || 0), 1);
  const maxOrd = Math.max(...data.map(d => d.order_count || 0), 1);
  const BAR_H  = 180; // chiều cao tối đa cột

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display:'flex', alignItems:'flex-end', gap: data.length > 8 ? 6 : 12, minWidth: 300, padding:'0 4px', height: BAR_H + 28 }}>
        {data.map((d, i) => {
          const pctRev = ((d.revenue     || 0) / maxRev) * BAR_H;
          const pctOrd = ((d.order_count || 0) / maxOrd) * BAR_H;
          // period = 'YYYY-MM-DD' → lấy ngày (2 ký tự cuối)
          const label  = d.period ? String(d.period).slice(-2).replace(/^0/, '') : '';
          return (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:0, minWidth: data.length > 8 ? 18 : 28 }}>
              {/* Bars */}
              <div style={{ display:'flex', alignItems:'flex-end', gap:2, height: BAR_H, width:'100%' }}>
                {/* Cột Doanh thu */}
                <div title="Doanh thu" style={{
                  flex:1, height: Math.max(pctRev, 2),
                  background:'linear-gradient(180deg,#3b82f6,#1d4ed8)',
                  borderRadius:'4px 4px 0 0',
                  transition:'height .4s ease',
                  boxShadow:'0 0 8px #3b82f644',
                }} />
                {/* Cột Số đơn */}
                <div title="Số đơn" style={{
                  flex:1, height: Math.max(pctOrd, 2),
                  background:'linear-gradient(180deg,#22c55e,#15803d)',
                  borderRadius:'4px 4px 0 0',
                  transition:'height .4s ease',
                  boxShadow:'0 0 8px #22c55e44',
                }} />
              </div>
              {/* Label tháng */}
              <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:5, textAlign:'center' }}>{label}</div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display:'flex', gap:18, justifyContent:'center', marginTop:8 }}>
        <span style={{ fontSize:'0.75rem', color:'#3b82f6', display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:12, height:12, background:'linear-gradient(180deg,#3b82f6,#1d4ed8)', borderRadius:3, display:'inline-block' }} /> Doanh thu
        </span>
        <span style={{ fontSize:'0.75rem', color:'#22c55e', display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:12, height:12, background:'linear-gradient(180deg,#22c55e,#15803d)', borderRadius:3, display:'inline-block' }} /> Số đơn
        </span>
      </div>
    </div>
  );
}

// ── Status Donut / Bar ────────────────────────────────────────────────────────
function StatusBreakdown({ data }) {
  // Luôn hiển thị "Đã hủy" dù có 0 đơn; các trạng thái khác giữ nguyên từ backend
  const dataMap = Object.fromEntries((data || []).map(b => [b.status, b]));
  if (!dataMap['da_huy']) dataMap['da_huy'] = { status: 'da_huy', count: 0, amount: 0 };
  const fullData = Object.values(dataMap);
  const total = fullData.reduce((s, x) => s + (x.count || 0), 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {fullData.map(b => {
        const st  = STATUS_MAP[b.status] || { label: b.status, color: 'var(--text-muted)' };
        const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
        return (
          <div key={b.status}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:5 }}>
              <span style={{ fontWeight:700, color: b.count > 0 ? st.color : 'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:9, height:9, borderRadius:'50%', background: b.count > 0 ? st.color : 'var(--surface-3)', display:'inline-block' }} />
                {st.label}
              </span>
              <span style={{ color:'var(--text-muted)' }}>{fmtNum(b.count)} đơn — {pct}%</span>
            </div>
            <div style={{ height:8, background:'var(--surface-3)', borderRadius:4, overflow:'hidden' }}>
              <div style={{
                height:'100%', width:`${pct}%`, background: st.color,
                borderRadius:4, transition:'width .5s ease',
                boxShadow: pct > 0 ? `0 0 8px ${st.color}55` : 'none'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminReports() {
  const now = new Date();
  const [year,    setYear]    = useState(now.getFullYear());
  const [mode,    setMode]    = useState('year');    // year | quarter | month
  const [quarter, setQuarter] = useState('');
  const [month,   setMonth]   = useState('');
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const params = { year };
      if (mode === 'quarter' && quarter) params.quarter = quarter;
      if (mode === 'month'   && month)   params.month   = month;
      const r = await axios.get(`${API}/admin/reports/revenue`, { ...getAuth(), params });
      setReport(r.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể tải báo cáo.');
    } finally { setLoading(false); }
  };

  useEffect(() => { document.title = 'Báo cáo – Admin'; load(); }, []);

  const s         = report?.summary || {};
  const chart     = report?.revenue_chart || [];
  const tops      = report?.top_products || [];
  const breakdown = report?.status_breakdown || [];

  const YEAR_OPTS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  const periodLabel = () => {
    if (mode === 'quarter' && quarter) return `${QUARTERS[parseInt(quarter)-1]} năm ${year}`;
    if (mode === 'month'   && month)   return `Tháng ${month} năm ${year}`;
    return `Cả năm ${year}`;
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h2 style={{ fontWeight:800, fontSize:'1.4rem', display:'flex', alignItems:'center', gap:8 }}>
          <BarChart2 size={22} color="var(--accent)" /> Báo cáo &amp; Thống kê
        </h2>
        <span style={{ color:'var(--text-muted)', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:4 }}>
          <Calendar size={13} /> {now.toLocaleDateString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </span>
      </div>

      {/* Bộ lọc */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-body" style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end' }}>
          {/* Năm */}
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Năm</label>
            <select className="form-control" value={year} onChange={e => setYear(parseInt(e.target.value))}>
              {YEAR_OPTS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Chế độ lọc */}
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Lọc theo</label>
            <div style={{ display:'flex', gap:6 }}>
              {['year','quarter','month'].map(m => (
                <button key={m} className={`btn btn-sm ${mode===m?'btn-primary':'btn-outline'}`}
                  onClick={() => { setMode(m); setQuarter(''); setMonth(''); }}>
                  {m==='year'?'Cả năm':m==='quarter'?'Theo quý':'Theo tháng'}
                </button>
              ))}
            </div>
          </div>

          {/* Quý */}
          {mode === 'quarter' && (
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Chọn quý</label>
              <div style={{ display:'flex', gap:6 }}>
                {[1,2,3,4].map(q => (
                  <button key={q} className={`btn btn-sm ${quarter==q?'btn-primary':'btn-ghost'}`}
                    style={{ border:'1px solid var(--border)' }}
                    onClick={() => setQuarter(String(q))}>
                    Q{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tháng */}
          {mode === 'month' && (
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Chọn tháng</label>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {MONTHS.map((m, i) => (
                  <button key={i} className={`btn btn-sm ${month==i+1?'btn-primary':'btn-ghost'}`}
                    style={{ border:'1px solid var(--border)', minWidth:36 }}
                    onClick={() => setMonth(String(i+1))}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-sm" onClick={load} style={{ display:'flex', alignItems:'center', gap:6, alignSelf:'flex-end' }}>
            <RefreshCw size={13} /> Xem báo cáo
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid #ef4444', color:'#ef4444',
          borderRadius:8, padding:'12px 16px', marginBottom:20, fontSize:'0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <>
          {/* Summary cards — chỉ hiện Số đơn + Khách hàng */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:20 }}>
            {[
              { icon:<ShoppingBag size={18}/>, label:'Số đơn hàng',   value: fmtNum(s.total_orders),     color:'icon-green' },
              { icon:<Users size={18}/>,       label:'Khách hàng',    value: fmtNum(s.unique_customers), color:'icon-blue' },
            ].map(c => (
              <div key={c.label} className="stat-card">
                <div className={`stat-card__icon ${c.color}`}>{c.icon}</div>
                <div>
                  <div className="stat-card__value" style={{ fontSize:'1.15rem' }}>{c.value}</div>
                  <div className="stat-card__label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Biểu đồ cột doanh thu */}
          <div className="card" style={{ marginBottom:20 }}>
            <div className="card-body">
              <h3 style={{ fontWeight:700, marginBottom:16 }}>
                📊 Biểu đồ — {periodLabel()}
              </h3>
              <GroupedBarChart data={chart} />
            </div>
          </div>

          {/* Bottom 2 cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, flexWrap:'wrap' }}>

            {/* Top 3 sản phẩm */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
                  <Package size={16} /> Top 3 sản phẩm bán chạy
                </h3>
                {tops.length === 0
                  ? <div style={{ textAlign:'center', padding:24, color:'var(--text-muted)' }}>Chưa có dữ liệu</div>
                  : <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      {tops.map((p, i) => (
                        <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12,
                          padding:'12px 14px', borderRadius:10,
                          background: i===0?'rgba(245,158,11,0.08)':i===1?'rgba(148,163,184,0.06)':'rgba(234,88,12,0.06)',
                          border: i===0?'1px solid rgba(245,158,11,0.25)':i===1?'1px solid rgba(148,163,184,0.18)':'1px solid rgba(234,88,12,0.18)',
                        }}>
                          <span style={{ fontSize:'1.6rem' }}>{MEDAL[i]}</span>
                          {p.thumbnail && <img src={p.thumbnail} alt="" style={{ width:42, height:42, objectFit:'cover', borderRadius:8 }} />}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:'0.88rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:2 }}>Đã bán: <strong>{fmtNum(p.total_sold)}</strong></div>
                          </div>
                          <div style={{ fontWeight:800, fontSize:'0.85rem', color:'var(--accent)', whiteSpace:'nowrap' }}>{fmt(p.total_revenue)}</div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>

            {/* Phân tích trạng thái đơn */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight:700, marginBottom:14 }}>📊 Phân tích trạng thái đơn hàng</h3>
                {breakdown.length === 0
                  ? <div style={{ textAlign:'center', padding:24, color:'var(--text-muted)' }}>Chưa có dữ liệu</div>
                  : <StatusBreakdown data={breakdown} />
                }
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
