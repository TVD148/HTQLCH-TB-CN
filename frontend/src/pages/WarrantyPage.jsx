import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, Send } from 'lucide-react';
import { warrantyApi, orderApi } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  pending:    { label:'Chờ xử lý',    cls:'badge-pending',   color:'var(--amber)' },
  processing: { label:'Đang xử lý',   cls:'badge-confirmed', color:'var(--accent)' },
  resolved:   { label:'Đã giải quyết',cls:'badge-delivered', color:'var(--emerald)' },
  rejected:   { label:'Từ chối',      cls:'badge-cancelled', color:'var(--red)' },
};

export default function WarrantyPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ order_item_id:'', issue_description:'', contact_phone: user?.phone||'' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    warrantyApi.getAll().then(r => setRequests(r.data.data));
    orderApi.getAll().then(r => setOrders(r.data.data));
  };

  useEffect(() => {
    document.title='Bảo hành – TechStore';
    load();
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.order_item_id || !form.issue_description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!'); return;
    }
    setSubmitting(true);
    try {
      await warrantyApi.create(form);
      toast.success('Yêu cầu bảo hành đã được gửi! Chúng tôi sẽ liên hệ trong 48 giờ.');
      setShowForm(false); setForm({order_item_id:'',issue_description:'',contact_phone:user?.phone||''}); load();
    } catch (err) { toast.error(err.response?.data?.message||'Có lỗi xảy ra!'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="section"><div className="container">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:'1.6rem',fontWeight:800}}>🛡️ Trung tâm bảo hành</h1>
          <p style={{color:'var(--text-muted)',marginTop:4,fontSize:'0.88rem'}}>Gửi yêu cầu bảo hành và theo dõi tiến trình xử lý</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}>
          {showForm?'Ẩn form':'+ Tạo yêu cầu bảo hành'}
        </button>
      </div>

      {/* Info banners */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
        {[
          {icon:'🔒',title:'Bảo hành chính hãng',desc:'12–24 tháng tùy sản phẩm, đổi mới nếu lỗi sản xuất trong 15 ngày'},
          {icon:'⏱️',title:'Thời gian xử lý',     desc:'7–14 ngày làm việc. Sản phẩm được hoàn trả tại nhà sau khi sửa'},
          {icon:'📦',title:'Hỗ trợ Free ship',    desc:'Miễn phí vận chuyển 2 chiều khi gửi bảo hành trên 3 triệu'},
        ].map(b=>(
          <div key={b.title} className="card"><div className="card-body" style={{textAlign:'center',padding:'20px 16px'}}>
            <div style={{fontSize:'2rem',marginBottom:10}}>{b.icon}</div>
            <div style={{fontWeight:700,marginBottom:6}}>{b.title}</div>
            <div style={{fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.5}}>{b.desc}</div>
          </div></div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{marginBottom:24}}>
          <div className="card-body">
            <h3 style={{fontWeight:700,marginBottom:20}}>📝 Tạo yêu cầu bảo hành mới</h3>
            <form onSubmit={handleSubmit} style={{display:'grid',gap:14,maxWidth:560}}>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Chọn đơn hàng / sản phẩm cần bảo hành *</label>
                <select className="form-control" value={form.order_item_id} onChange={e=>setForm(f=>({...f,order_item_id:e.target.value}))} required>
                  <option value="">Chọn sản phẩm từ đơn hàng của bạn</option>
                  {orders.filter(o=>o.status==='delivered').map(o=>(
                    <option key={o.id} value={`order_${o.id}`} disabled style={{fontWeight:700,color:'#000'}}>
                      ── Đơn {o.order_code} ──
                    </option>
                  ))}
                  {orders.length === 0 && <option disabled>Không có đơn hàng đủ điều kiện bảo hành</option>}
                </select>
                <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:4}}>Chỉ đơn hàng có trạng thái "Đã giao" mới đủ điều kiện</div>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Mô tả vấn đề *</label>
                <textarea className="form-control" rows={4} required
                  placeholder="Mô tả chi tiết lỗi hỏng hóc: Màn hình bị sọc, pin không sạc, phím không nhận..."
                  value={form.issue_description} onChange={e=>setForm(f=>({...f,issue_description:e.target.value}))}/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Số điện thoại liên hệ</label>
                <input className="form-control" type="tel" value={form.contact_phone}
                  onChange={e=>setForm(f=>({...f,contact_phone:e.target.value}))} placeholder="0901234567"/>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={14}/> {submitting?'Đang gửi...':'Gửi yêu cầu'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={()=>setShowForm(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {requests.length === 0 ? (
        <div className="empty-state">
          <Shield size={48} style={{opacity:.3}}/>
          <div className="empty-state__title">Chưa có yêu cầu bảo hành</div>
          <div className="empty-state__desc">Tạo yêu cầu khi sản phẩm gặp sự cố</div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {requests.map(r=>{
            const s = STATUS_MAP[r.status]||STATUS_MAP.pending;
            return (
              <div key={r.id} className="card"><div className="card-body">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,marginBottom:6}}>{r.product_name}</div>
                    <div style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:8}}>
                      Đơn hàng: #{r.order_code} · Ngày tạo: {new Date(r.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{fontSize:'0.88rem',color:'var(--text-secondary)',background:'var(--surface-3)',padding:'8px 12px',borderRadius:8}}>
                      🛠️ {r.issue_description}
                    </div>
                    {r.admin_note && (
                      <div style={{marginTop:10,fontSize:'0.85rem',color:s.color,fontWeight:600,background:`rgba(${s.color==='var(--emerald)'?'16,185,129':'245,158,11'},0.1)`,padding:'8px 12px',borderRadius:8}}>
                        📋 Phản hồi: {r.admin_note}
                      </div>
                    )}
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span className={`badge ${s.cls}`}>{s.label}</span>
                    {r.updated_at && r.status!=='pending' && (
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:6}}>
                        Cập nhật: {new Date(r.updated_at).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                </div>
              </div></div>
            );
          })}
        </div>
      )}
    </div></div>
  );
}
