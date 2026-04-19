import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Tag, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, applyVoucher, removeVoucher, voucher, finalTotal } = useCart();
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  const handleVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await applyVoucher(voucherCode.trim());
      toast.success(res.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Mã không hợp lệ!'); }
    finally { setVoucherLoading(false); }
  };

  if (!cart.items.length) return (
    <div className="section"><div className="container"><div className="empty-state">
      <div className="empty-state__icon"><ShoppingBag /></div>
      <div className="empty-state__title">Giỏ hàng trống</div>
      <div className="empty-state__desc">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</div>
      <Link to="/shop" className="btn btn-primary" style={{marginTop:16}}>Mua sắm ngay</Link>
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
          {voucher && <div className="summary-row discount"><span>Giảm ({voucher.voucher_code})</span><span>-{fmt(voucher.discount_amount)}</span></div>}
          <div className="summary-row"><span>Phí vận chuyển</span><span style={{color:'var(--emerald)'}}>Miễn phí</span></div>
          <div className="summary-row total"><span>Tổng cộng</span><span style={{color:'var(--accent)',fontSize:'1.2rem'}}>{fmt(finalTotal)}</span></div>

          {/* Voucher */}
          {!voucher ? (
            <div className="voucher-input-wrap">
              <input className="form-control form-control-sm" placeholder="Nhập mã giảm giá" value={voucherCode} onChange={e=>setVoucherCode(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleVoucher()} style={{flex:1}} />
              <button className="btn btn-outline btn-sm" onClick={handleVoucher} disabled={voucherLoading}><Tag size={14}/> Áp dụng</button>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'var(--emerald-light)',border:'1px solid var(--emerald)',borderRadius:'var(--radius-md)',marginTop:12,fontSize:'0.85rem'}}>
              <Tag size={14} color="var(--emerald)"/>
              <span style={{flex:1,color:'var(--emerald)',fontWeight:600}}>{voucher.voucher_code}</span>
              <button onClick={()=>{removeVoucher();setVoucherCode('');}} style={{background:'none',border:'none',color:'var(--emerald)',cursor:'pointer'}}><X size={14}/></button>
            </div>
          )}

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