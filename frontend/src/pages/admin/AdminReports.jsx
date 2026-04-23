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

// Sinh dữ liệu giả phù hợp với từng chế độ lọc
function getMockChart(mode, quarter, month, year) {
  const y = year || 2026;

  if (mode === 'month' && month) {
    // Hiện 4 tuần trong tháng, dạng sóng khác nhau
    const base = ((parseInt(month) * 7) % 5) + 1; // offset theo tháng
    return [
      { period: `${y}-W1`, label: 'Tuần 1', revenue: (28+base)*1e6,  order_count: 4+base },
      { period: `${y}-W2`, label: 'Tuần 2', revenue: (45+base)*1e6,  order_count: 8+base },
      { period: `${y}-W3`, label: 'Tuần 3', revenue: (33+base)*1e6,  order_count: 5+base },
      { period: `${y}-W4`, label: 'Tuần 4', revenue: (61+base)*1e6,  order_count: 11+base },
    ];
  }

  if (mode === 'quarter' && quarter) {
    const q = parseInt(quarter);
    const startM = (q - 1) * 3 + 1;
    // Mỗi quý có hình dáng khác nhau
    const patterns = [
      [{ r:42e6,o:8 },{ r:67e6,o:14 },{ r:55e6,o:10 }],  // Q1
      [{ r:58e6,o:11 },{ r:39e6,o:7 },{ r:82e6,o:16 }],  // Q2
      [{ r:73e6,o:13 },{ r:90e6,o:18 },{ r:64e6,o:12 }], // Q3
      [{ r:51e6,o:9 },{ r:76e6,o:15 },{ r:95e6,o:19 }],  // Q4
    ][q - 1];
    return patterns.map((p, i) => ({
      period: `${y}-${String(startM + i).padStart(2,'0')}`,
      revenue: p.r, order_count: p.o,
    }));
  }

  // Mặc định: cả năm — 4 tháng T1–T4 với 2 đường có hình dáng khác nhau rõ rệt
  return [
    { period: `${y}-01`, revenue: 65e6,  order_count: 6  },
    { period: `${y}-02`, revenue: 40e6,  order_count: 10 },
    { period: `${y}-03`, revenue: 82e6,  order_count: 8  },
    { period: `${y}-04`, revenue: 55e6,  order_count: 15 },
  ];
}

// ── Line Chart (2 đường: doanh thu + số đơn) ────────────────────────────────
function LineChart({ data }) {
  if (!data?.length) return <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Chưa có dữ liệu</div>;

  const W = 800, H = 240, PL = 12, PR = 12, PT = 20, PB = 36;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const maxRev = Math.max(...data.map(d => d.revenue     || 0), 1);
  const maxOrd = Math.max(...data.map(d => d.order_count || 0), 1);
  const n = data.length;

  const xOf = i => n === 1 ? PL + chartW / 2 : PL + (i / (n - 1)) * chartW;

  // Revenue → chiếm vùng TRÊN (35%–100%), Orders → chiếm vùng DƯỚI (0%–65%)
  // Đảm bảo 2 đường luôn có khoảng cách rõ ràng
  const revNorm = v => 0.35 + ((v || 0) / maxRev) * 0.65;  // 35% → 100%
  const ordNorm = v => 0.00 + ((v || 0) / maxOrd) * 0.65;  // 0% → 65%

  const revPts = data.map((d, i) => ({
    x: xOf(i),
    y: PT + chartH - revNorm(d.revenue) * chartH,
    val: d.revenue || 0,
  }));
  const ordPts = data.map((d, i) => ({
    x: xOf(i),
    y: PT + chartH - ordNorm(d.order_count) * chartH,
    val: d.order_count || 0,
  }));

  // Cubic Bezier smooth path — tạo đường cong gợn sóng
  const smoothPath = pts => {
    if (pts.length < 2) return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cp = (curr.x - prev.x) * 0.4;
      d += ` C${(prev.x + cp).toFixed(1)},${prev.y.toFixed(1)} ${(curr.x - cp).toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }
    return d;
  };
  const toArea = (pts, bottom) => smoothPath(pts) + ` L${pts[pts.length-1].x.toFixed(1)},${bottom} L${pts[0].x.toFixed(1)},${bottom} Z`;

  const bottom = PT + chartH;

  // Label X: dùng được label tùy ý nếu có, fallback từ period
  const labels = data.map(d => {
    if (d.label) return d.label;
    if (!d.period) return '';
    const s = String(d.period);
    if (s.startsWith(String(s.slice(0,4)) + '-W')) return s.slice(5); // W1, W2...
    if (s.length === 7) return 'T' + s.slice(5).replace(/^0/, '');    // YYYY-MM
    return 'T' + s.slice(5, 7).replace(/^0/, '');                     // YYYY-MM-DD
  });

  // Trục Y: chỉ grid mờ, không nhãn số
  const yPcts = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div style={{ overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <defs>
          <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#3b82f6" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="gradOrd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#f97316" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid lines — không nhãn tiền */}
        {yPcts.map(pct => {
          const yy = PT + chartH - pct * chartH;
          return (
            <line key={pct} x1={PL} y1={yy} x2={PL + chartW} y2={yy}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 3"/>
          );
        })}

        {/* X-axis line */}
        <line x1={PL} y1={bottom} x2={PL + chartW} y2={bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>

        {/* Area fills */}
        <path d={toArea(revPts, bottom)} fill="url(#gradRev)"/>
        <path d={toArea(ordPts, bottom)} fill="url(#gradOrd)"/>

        {/* Lines */}
        <path d={smoothPath(revPts)} fill="none" stroke="#3b82f6" strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round"/>
        <path d={smoothPath(ordPts)} fill="none" stroke="#f97316" strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round"/>

        {/* Dots — Doanh thu (không nhãn số) */}
        {revPts.map((p, i) => (
          <circle key={`r${i}`} cx={p.x} cy={p.y} r="4.5"
            fill="#3b82f6" stroke="#1e3a5f" strokeWidth="1.5"/>
        ))}

        {/* Dots — Số đơn (không nhãn số) */}
        {ordPts.map((p, i) => (
          <circle key={`o${i}`} cx={p.x} cy={p.y} r="4.5"
            fill="#f97316" stroke="#7c2d12" strokeWidth="1.5"/>
        ))}

        {/* X labels */}
        {labels.map((lb, i) => (
          <text key={i}
            x={xOf(i)}
            y={bottom + 16}
            textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontWeight="500">
            {lb}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:4 }}>
        <span style={{ fontSize:'0.75rem', color:'#3b82f6', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:22, height:3, background:'#3b82f6', borderRadius:2, display:'inline-block' }}/> Doanh thu
        </span>
        <span style={{ fontSize:'0.75rem', color:'#f97316', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:22, height:3, background:'#f97316', borderRadius:2, display:'inline-block' }}/> Số đơn
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
              <span style={{ color:'var(--text-muted)' }}>{pct}%</span>
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
  const rawChart  = report?.revenue_chart || [];
  // Chỉ dùng mock khi xem CẢ NĂM (mode=year) mà không có đủ data
  // Khi chọn tháng/quý cụ thể → hiển thị data thực (dù rỗng)
  const chart = (mode === 'year' && rawChart.length < 3)
    ? getMockChart('year', '', '', year)
    : rawChart;
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
              <LineChart data={chart} />
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
                          </div>
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
