import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { wishlistApi } from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Yêu thích – TechStore';
    wishlistApi.getAll().then(r => setItems(r.data.data));
  }, []);

  const remove = async (productId) => {
    await wishlistApi.toggle(productId);
    setItems(prev => prev.filter(i => i.product_id !== productId));
    toast.success('Đã xóa khỏi yêu thích');
  };

  if (!items.length) return (
    <div className="section"><div className="container"><div className="empty-state" style={{textAlign: 'center', padding: '60px 0'}}>
      <div className="empty-state-icon-large" style={{ color: 'var(--red)', background: 'var(--red-light)' }}>
        <Heart size={56} strokeWidth={1.5} />
      </div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)'}}>Danh sách yêu thích trống</h2>
      <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 24}}>Bạn chưa có món đồ công nghệ yêu thích nào. Hãy khám phá và lưu lại nhé!</p>
      <Link to="/shop" className="btn btn-primary" style={{padding: '12px 32px', borderRadius: 40, fontSize: '1rem', boxShadow: 'var(--glow)'}}>Khám phá sản phẩm</Link>
    </div></div></div>
  );

  return (
    <div className="section"><div className="container">
      <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:28}}>❤️ Yêu thích ({items.length})</h1>
      <div className="products-grid">
        {items.map(item => (
          <div key={item.id} className="product-card">
            <Link to={`/shop/${item.slug}`}>
              <div style={{paddingTop:'75%',position:'relative',background:'var(--surface-3)'}}>
                <img src={item.thumbnail} alt={item.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}
                  onError={e=>{e.target.src=`https://placehold.co/300x225/1E293B/3B82F6?text=Tech`;}}/>
              </div>
            </Link>
            <div className="product-card__body">
              <div className="product-card__name">{item.name}</div>
              <div style={{color:'var(--accent)',fontWeight:700,marginBottom:10}}>{fmt(item.sale_price||item.price)}</div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={async()=>{await addToCart(item.product_id);toast.success('Đã thêm vào giỏ!');}}>
                  <ShoppingCart size={13}/> Thêm giỏ
                </button>
                <button className="btn btn-ghost btn-sm" onClick={()=>remove(item.product_id)} style={{color:'var(--red)'}}>
                  <Heart size={13} fill="currentColor"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  );
}
