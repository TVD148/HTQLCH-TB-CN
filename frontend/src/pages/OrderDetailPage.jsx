import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { orderApi } from '../api';
import { useCart } from '../context/CartContext';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);

const STATUS_MAP = {
  pending:   { label:'Chờ xác nhận', icon:<Clock size={18}/>,        cls:'badge-pending',   color:'var(--amber)' },
  confirmed: { label:'Đã xác nhận',  icon:<CheckCircle size={18}/>,  cls:'badge-confirmed', color:'var(--accent)' },
  shipping:  { label:'Đang giao',    icon:<Truck size={18}/>,        cls:'badge-shipping',  color:'#8B5CF6' },
  delivered: { label:'Đã giao',      icon:<CheckCircle size={18}/>,  cls:'badge-delivered', color:'var(--emerald)' },
  cancelled: { label:'Đã hủy',       icon:<XCircle size={18}/>,      cls:'badge-cancelled', color:'var(--red)' },
};

const PAYMENT_LABEL = { cod:'Thanh toán khi nhận hàng (COD)', bank_transfer:'Chuyển khoản ngân hàng', momo:'Ví MoMo', loyalty_points:'Điểm tích lũy' };

const STEPS = ['pending','confirmed','shipping','delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    document.title = 'Chi tiết đơn hàng – TechStore';
    orderApi.getById(id).then(r => setOrder(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setCancelling(true);
    try {
      await orderApi.cancel(id);
      setOrder(prev => ({...prev, status:'cancelled'}));
    } catch (err) { alert(err.response?.data?.message || 'Không thể hủy đơn!'); }
    finally { setCancelling(false); }
  };

  const handleReorder = async () => {
    if (!order?.items?.length) return;
    setReordering(true);
    try {
      for (const item of order.items) {
        await addToCart(item.product_id, item.quantity);
      }
      navigate('/cart');
    } catch { alert('Không thể thêm vào giỏ hàng!'); }
    finally { setReordering(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;
  if (!order)  return <div className="section"><div className="container"><p>Không tìm thấy đơn hàng.</p></div></div>;

  const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const stepIdx = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="section"><div className="container">
      {/* Back link */}
      <Link to="/profile?tab=orders" style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--text-muted)',fontSize:'0.88rem',marginBottom:20}}>
        <ArrowLeft size={14}/> Quay lại lịch sử đơn hàng
      </Link>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:'1.5rem',fontWeight:800}}>Đơn hàng #{order.order_code}</h1>
          <div style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:4}}>
            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
          </div>
        </div>
        <span className={`badge ${s.cls}`} style={{fontSize:'0.9rem',padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}>
          {s.icon} {s.label}
        </span>
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-body">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative'}}>
              {/* Line */}
              <div style={{position:'absolute',top:'50%',left:'12.5%',right:'12.5%',height:2,background:'var(--surface-3)',transform:'translateY(-50%)',zIndex:0}}/>
              <div style={{position:'absolute',top:'50%',left:'12.5%',height:2,background:'var(--accent)',transform:'translateY(-50%)',zIndex:1,
                width: stepIdx >= 0 ? `${(stepIdx / (STEPS.length-1))*75}%` : '0%', transition:'width .5s ease'}}/>
              {STEPS.map((step, i) => {
                const done = !isCancelled && stepIdx >= i;
                const active = stepIdx === i;
                return (
                  <div key={step} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,position:'relative',zIndex:2}}>
                    <div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      background: done ? 'var(--accent)' : 'var(--surface-3)',
                      border: active ? '3px solid var(--accent)' : '2px solid transparent',
                      transition:'all .3s',color:done?'#fff':'var(--text-muted)'}}>
                      {STATUS_MAP[step]?.icon}
                    </div>
                    <span style={{fontSize:'0.75rem',color:done?'var(--accent)':'var(--text-muted)',fontWeight:active?700:400,textAlign:'center'}}>
                      {STATUS_MAP[step]?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="cart-layout">
        {/* Left: Items + Shipping */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Products */}
          <div className="card"><div className="card-body">
            <h3 style={{fontWeight:700,marginBottom:16}}>Sản phẩm đã đặt</h3>
            {(order.items || []).map(item => (
              <div key={item.id} style={{display:'flex',gap:14,paddingBottom:12,marginBottom:12,borderBottom:'1px solid var(--border)'}}>
                <img src={item.product_thumbnail} alt={item.product_name}
                  style={{width:70,height:52,objectFit:'cover',borderRadius:8,background:'var(--surface-3)',flexShrink:0}}
                  onError={e=>{e.target.src='https://placehold.co/70x52/1E293B/3B82F6?text=IMG';}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.9rem',marginBottom:4}}>{item.product_name}</div>
                  <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Số lượng: {item.quantity}</div>
                  <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Đơn giá: {fmt(item.unit_price)}</div>
                </div>
                <div style={{fontWeight:700,color:'var(--accent)',whiteSpace:'nowrap'}}>{fmt(item.subtotal)}</div>
              </div>
            ))}
          </div></div>

          {/* Shipping Info */}
          <div className="card"><div className="card-body">
            <h3 style={{fontWeight:700,marginBottom:14}}>Thông tin giao hàng</h3>
            {[
              ['Người nhận', order.receiver_name],
              ['Số điện thoại', order.receiver_phone],
              ['Địa chỉ', order.shipping_address],
            ].map(([l, v]) => (
              <div key={l} style={{display:'flex',gap:10,marginBottom:10,fontSize:'0.88rem'}}>
                <span style={{color:'var(--text-muted)',minWidth:110}}>{l}:</span>
                <span style={{flex:1,color:'var(--text-primary)',fontWeight:500}}>{v}</span>
              </div>
            ))}
            {order.note && (
              <div style={{marginTop:10,padding:'8px 12px',background:'var(--surface-3)',borderRadius:8,fontSize:'0.85rem',color:'var(--text-secondary)'}}>
                📝 Ghi chú: {order.note}
              </div>
            )}
          </div></div>
        </div>

        {/* Right: Summary */}
        <div className="order-summary-card">
          <h3 style={{fontWeight:700,marginBottom:16}}>Tóm tắt thanh toán</h3>

          <div className="summary-row"><span>Tạm tính</span><span>{fmt(order.subtotal)}</span></div>
          {order.discount_amount > 0 && (
            <div className="summary-row discount"><span>Giảm giá</span><span>-{fmt(order.discount_amount)}</span></div>
          )}
          {order.loyalty_points_used > 0 && (
            <div className="summary-row" style={{color:'var(--amber)'}}><span>Điểm tích lũy dùng</span><span>-{fmt(order.loyalty_points_used*1000)}</span></div>
          )}
          <div className="summary-row"><span>Phí vận chuyển</span><span style={{color:'var(--emerald)'}}>Miễn phí</span></div>
          <div className="summary-row total"><span>Tổng cộng</span><span style={{color:'var(--accent)',fontSize:'1.2rem'}}>{fmt(order.total_amount)}</span></div>

          <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem',marginBottom:8}}>
              <span style={{color:'var(--text-muted)'}}>Phương thức thanh toán</span>
              <span style={{fontWeight:600}}>{PAYMENT_LABEL[order.payment_method] || order.payment_method}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
              <span style={{color:'var(--text-muted)'}}>Trạng thái thanh toán</span>
              <span style={{fontWeight:600,color:order.payment_status==='paid'?'var(--emerald)':'var(--amber)'}}>
                {order.payment_status==='paid'?'✅ Đã thanh toán':'⏳ Chưa thanh toán'}
              </span>
            </div>
          </div>

          {order.loyalty_points_earned > 0 && (
            <div style={{marginTop:14,padding:'10px',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:8,textAlign:'center',fontSize:'0.85rem',color:'var(--amber)'}}>
              ⭐ Bạn nhận được <strong>{order.loyalty_points_earned} điểm</strong> từ đơn hàng này!
            </div>
          )}

          {order.status === 'pending' && (
            <button className="btn btn-danger btn-full" style={{marginTop:16}} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Đang hủy...' : '❌ Hủy đơn hàng'}
            </button>
          )}

          {order.status === 'delivered' && (
            <button
              className="btn btn-primary btn-full"
              style={{marginTop:16,justifyContent:'center'}}
              onClick={handleReorder}
              disabled={reordering}
            >
              {reordering ? 'Đang thêm vào giỏ...' : '🔄 Mua lại'}
            </button>
          )}
        </div>
      </div>
    </div></div>
  );
}
