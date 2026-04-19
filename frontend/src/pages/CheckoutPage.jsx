import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);

export default function CheckoutPage() {
  const { cart, voucher, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receiver_name: user?.name || '',
    receiver_phone: user?.phone || '',
    shipping_address: user?.address || '',
    payment_method: 'cod',
    note: '',
  });
  const [pointsToUse, setPointsToUse] = useState(0);
  const [loading, setLoading] = useState(false);

  const maxPoints = Math.min(user?.loyalty_points || 0, Math.floor(finalTotal / 1000));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiver_name || !form.receiver_phone || !form.shipping_address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng!'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        voucher_id: voucher?.voucher_id || null,
        loyalty_points_used: pointsToUse,
      };
      const res = await orderApi.create(payload);
      toast.success(`Đặt hàng thành công! Mã đơn: ${res.data.data.order_code} 🎉`);
      navigate(`/orders/${res.data.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại!');
    } finally { setLoading(false); }
  };

  return (
    <div className="section"><div className="container">
      <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:28}}>📦 Thanh toán</h1>
      <form onSubmit={handleSubmit}>
        <div className="cart-layout">
          {/* Form */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {/* Shipping */}
            <div className="card"><div className="card-body">
              <h3 style={{fontWeight:700,marginBottom:16}}>Thông tin giao hàng</h3>
              {[
                {k:'receiver_name',   l:'Họ và tên người nhận', t:'text', p:'Nguyễn Văn A'},
                {k:'receiver_phone',  l:'Số điện thoại',        t:'tel',  p:'0901234567'},
                {k:'shipping_address',l:'Địa chỉ giao hàng',   t:'text', p:'Số nhà, đường, phường/xã, Q/H, tỉnh/TP'},
              ].map(f=>(
                <div key={f.k} className="form-group">
                  <label className="form-label">{f.l}</label>
                  <input className="form-control" type={f.t} placeholder={f.p} value={form[f.k]}
                    onChange={e=>setForm({...form,[f.k]:e.target.value})} required />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows={3} placeholder="Ghi chú đặc biệt cho đơn hàng (nếu có)..."
                  value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
              </div>
            </div></div>

            {/* Payment */}
            <div className="card"><div className="card-body">
              <h3 style={{fontWeight:700,marginBottom:16}}>Phương thức thanh toán</h3>
              {[
                {v:'cod',           l:'💵 Thanh toán khi nhận hàng (COD)'},
                {v:'bank_transfer', l:'🏦 Chuyển khoản ngân hàng'},
                {v:'momo',          l:'💜 Ví MoMo'},
              ].map(m=>(
                <label key={m.v} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',cursor:'pointer',borderBottom:'1px solid var(--border)'}}>
                  <input type="radio" name="payment" value={m.v} checked={form.payment_method===m.v}
                    onChange={e=>setForm({...form,payment_method:e.target.value})} style={{accentColor:'var(--accent)'}} />
                  <span style={{fontSize:'0.9rem'}}>{m.l}</span>
                </label>
              ))}
            </div></div>

            {/* Loyalty Points */}
            {user?.loyalty_points > 0 && (
              <div className="card"><div className="card-body">
                <h3 style={{fontWeight:700,marginBottom:12}}>⭐ Dùng điểm tích lũy</h3>
                <div style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:12}}>
                  Bạn có <strong style={{color:'var(--amber)'}}>{user.loyalty_points} điểm</strong> (= {fmt(user.loyalty_points * 1000)})
                </div>
                <input type="range" min={0} max={maxPoints} value={pointsToUse}
                  onChange={e=>setPointsToUse(parseInt(e.target.value))}
                  style={{width:'100%',accentColor:'var(--amber)'}} />
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',color:'var(--text-muted)',marginTop:4}}>
                  <span>0</span>
                  <span style={{color:'var(--amber)',fontWeight:600}}>Dùng {pointsToUse} điểm = -{fmt(pointsToUse*1000)}</span>
                  <span>{maxPoints}</span>
                </div>
              </div></div>
            )}
          </div>

          {/* Summary */}
          <div className="order-summary-card">
            <div style={{fontWeight:700,marginBottom:16}}>Đơn hàng của bạn</div>
            <div style={{maxHeight:240,overflowY:'auto',marginBottom:16}}>
              {cart.items.map(item=>(
                <div key={item.id} style={{display:'flex',gap:10,marginBottom:10,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
                  <img src={item.thumbnail} alt={item.name} style={{width:48,height:36,objectFit:'cover',borderRadius:6,background:'var(--surface-3)'}}
                    onError={e=>{e.target.src='https://placehold.co/48x36/1E293B/3B82F6?text=IMG';}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.8rem',fontWeight:600,display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:1,overflow:'hidden'}}>{item.name}</div>
                    <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>x{item.quantity}</div>
                  </div>
                  <span style={{fontSize:'0.85rem',fontWeight:700,color:'var(--accent)'}}>{fmt(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="summary-row"><span>Tạm tính</span><span>{fmt(cart.subtotal)}</span></div>
            {voucher && <div className="summary-row discount"><span>Voucher ({voucher.voucher_code})</span><span>-{fmt(voucher.discount_amount)}</span></div>}
            {pointsToUse > 0 && <div className="summary-row" style={{color:'var(--amber)'}}><span>Điểm tích lũy</span><span>-{fmt(pointsToUse*1000)}</span></div>}
            <div className="summary-row"><span>Phí vận chuyển</span><span style={{color:'var(--emerald)'}}>Miễn phí</span></div>
            <div className="summary-row total"><span>Tổng cộng</span><span style={{color:'var(--accent)',fontSize:'1.3rem'}}>{fmt(finalTotal - pointsToUse*1000)}</span></div>
            <button type="submit" className="btn btn-primary btn-full" style={{marginTop:16,height:48,fontSize:'1rem'}} disabled={loading || !cart.items.length}>
              {loading ? 'Đang xử lý...' : '🎉 Đặt hàng ngay'}
            </button>
          </div>
        </div>
      </form>
    </div></div>
  );
}
