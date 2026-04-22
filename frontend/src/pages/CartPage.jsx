import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, finalTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cart.items.length) return (
    <div className="section"><div className="container"><div className="empty-state" style={{textAlign: 'center', padding: '60px 0'}}>
      <div className="empty-state-icon-large">
        <ShoppingBag size={56} strokeWidth={1.5} />
      </div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)'}}>Giỏ hàng trống!</h2>
      <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 24}}>Giỏ hàng của bạn đang buồn vì trống rỗng, hãy thêm món đồ công nghệ nào đó đi!</p>
      <Link to="/shop" className="btn btn-primary" style={{padding: '12px 32px', borderRadius: 40, fontSize: '1rem', boxShadow: 'var(--glow)'}}>Bắt đầu mua sắm</Link>
    </div></div></div>
  );

  return (
    <div className="section"><div className="container">
      <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:28}}>🛒 Giỏ hàng ({cart.item_count} sản phẩm)</h1>
      <div className="cart-layout">
        {/* Items */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.name} className="cart-item__img"
                onError={e=>{e.target.src=`https://placehold.co/88x66/1E293B/3B82F6?text=IMG`;}} />
              <div>
                <Link to={`/shop/${item.slug}`} style={{fontWeight:600,fontSize:'0.9rem',display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:2,overflow:'hidden'}}>{item.name}</Link>
                <div style={{color:'var(--accent)',fontWeight:700,marginTop:4}}>{fmt(item.unit_price)}</div>
                <div className="qty-control" style={{marginTop:8,width:'fit-content'}}>
                  <button className="qty-btn" onClick={()=>item.quantity>1?updateItem(item.id,item.quantity-1):removeItem(item.id)}>−</button>
                  <input className="qty-input" value={item.quantity} readOnly />
                  <button className="qty-btn" onClick={()=>updateItem(item.id,item.quantity+1)} disabled={item.quantity>=item.stock_quantity}>+</button>
                </div>
              </div>
              <div style={{textAlign:'right',display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                <span style={{fontWeight:700,color:'var(--text-primary)'}}>{fmt(item.subtotal)}</span>
                <button onClick={()=>removeItem(item.id)} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer'}}><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          <button onClick={()=>{clearCart();toast.success('Đã xóa giỏ hàng');}} className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start',color:'var(--red)'}}>
            <Trash2 size={14}/> Xóa tất cả
          </button>
        </div>

        {/* Summary */}
        <div className="order-summary-card">
          <div style={{fontWeight:700,fontSize:'1rem',marginBottom:16}}>Tóm tắt đơn hàng</div>
          <div className="summary-row"><span>Tạm tính</span><span>{fmt(cart.subtotal)}</span></div>
          <div className="summary-row total"><span>Tổng cộng</span><span style={{color:'var(--accent)',fontSize:'1.2rem'}}>{fmt(finalTotal)}</span></div>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:8, textAlign:'center' }}>Mã giảm giá &amp; voucher áp dụng ở bước thanh toán</p>

          <button className="btn btn-primary btn-full" style={{marginTop:16,height:46,fontSize:'1rem'}}
            onClick={()=>user?navigate('/checkout'):navigate('/login',{state:{from:{pathname:'/checkout'}}})}>
            <ShoppingBag size={18}/> {user?'Thanh toán':'Đăng nhập để thanh toán'}
          </button>
          <Link to="/shop" className="btn btn-ghost btn-full btn-sm" style={{marginTop:8}}>← Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div></div>
  );
}