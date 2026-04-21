import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, BarChart2, Star } from 'lucide-react';
import { productApi, wishlistApi } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p);
const calcDiscount = (p, sp) => sp ? Math.round(((p-sp)/p)*100) : 0;

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi.getBySlug(slug)
      .then(r => { setProduct(r.data.data); document.title = `${r.data.data.name} – TechStore`; })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddCart = async () => {
    if (!user) { toast.error('Vui lòng đăng nhập!'); navigate('/login'); return; }
    try { await addToCart(product.id, qty); toast.success('Đã thêm vào giỏ hàng! 🛒'); }
    catch (err) { toast.error(err.response?.data?.message || 'Lỗi!'); }
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Vui lòng đăng nhập!'); return; }
    const res = await wishlistApi.toggle(product.id);
    setWishlisted(res.data.wishlisted);
    toast.success(res.data.message);
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;
  if (!product) return null;

  const images = product.images?.length ? product.images.map(i => i.image_url) : [product.thumbnail];
  const discPct = calcDiscount(product.price, product.sale_price);

  return (
    <div className="section"><div className="container">
      {/* Breadcrumb */}
      <div style={{display:'flex',gap:8,fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
        <Link to="/" style={{color:'var(--text-muted)',textDecoration:'none'}}>Trang chủ</Link>
        <span style={{color:'var(--surface-3)'}}>/</span>
        <Link to="/shop" style={{color:'var(--text-muted)',textDecoration:'none'}}>Sản phẩm</Link>
        <span style={{color:'var(--surface-3)'}}>/</span>
        <span style={{color:'var(--text-primary)',fontWeight:600}}>{product.name}</span>
      </div>

      {/* Main Product Grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:36,marginBottom:48}}>
        {/* Images */}
        <div>
          <div style={{position:'relative',paddingTop:'75%',background:'var(--surface-2)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:12,border:'1px solid var(--border)'}}>
            {discPct > 0 && <span className="badge badge-sale" style={{position:'absolute',top:12,left:12,zIndex:1}}>-{discPct}%</span>}
            <img src={images[activeImg] || product.thumbnail} alt={product.name}
              style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',padding:20}}
              onError={e => { e.target.src = `https://placehold.co/500x375/1E293B/3B82F6?text=TechStore`; }} />
          </div>
          {images.length > 1 && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{width:64,height:48,borderRadius:8,overflow:'hidden',cursor:'pointer',border:`2px solid ${i===activeImg?'var(--accent)':'var(--border)'}`,background:'var(--surface-2)'}}>
                  <img src={img} style={{width:'100%',height:'100%',objectFit:'cover'}}
                    onError={e => { e.target.src = 'https://placehold.co/64x48/1E293B/3B82F6?text=IMG'; }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div style={{fontSize:'0.78rem',color:'var(--accent)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{product.brand_name}</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:800,lineHeight:1.3,marginBottom:12}}>{product.name}</h1>

          {product.avg_rating > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <div className="stars">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s<=Math.round(product.avg_rating)?'var(--amber)':'none'} color={s<=Math.round(product.avg_rating)?'var(--amber)':'var(--surface-3)'} />)}
              </div>
              <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{Number(product.avg_rating).toFixed(1)}/5</span>
            </div>
          )}

          {/* Price */}
          <div style={{marginBottom:20}}>
            {product.sale_price ? (
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <span style={{fontSize:'2rem',fontWeight:900,color:'var(--accent)'}}>{fmt(product.sale_price)}</span>
                <span style={{fontSize:'1rem',color:'var(--text-muted)',textDecoration:'line-through'}}>{fmt(product.price)}</span>
                <span className="badge badge-sale">Tiết kiệm {fmt(product.price - product.sale_price)}</span>
              </div>
            ) : (
              <span style={{fontSize:'2rem',fontWeight:900,color:'var(--text-primary)'}}>{fmt(product.price)}</span>
            )}
          </div>

          {product.short_desc && (
            <p style={{fontSize:'0.88rem',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:20,padding:'12px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>{product.short_desc}</p>
          )}

          <div style={{marginBottom:16,fontSize:'0.85rem'}}>
            {product.stock_quantity > 0
              ? <span style={{color:'var(--emerald)'}}>✅ Còn hàng ({product.stock_quantity} sản phẩm)</span>
              : <span style={{color:'var(--red)'}}>❌ Hết hàng</span>}
          </div>

          {product.stock_quantity > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
              <div className="qty-control" style={{ height: 54, padding: '0 8px', borderRadius: 'var(--radius-md)' }}>
                <button className="qty-btn" style={{ width: 36, height: 36, fontSize: '1.2rem' }} onClick={() => qty > 1 && setQty(q => q-1)}>−</button>
                <input className="qty-input" style={{ width: 44, fontSize: '1.1rem', fontWeight: 700 }} value={qty} readOnly />
                <button className="qty-btn" style={{ width: 36, height: 36, fontSize: '1.2rem' }} onClick={() => qty < product.stock_quantity && setQty(q => q+1)}>+</button>
              </div>
              <button className="btn btn-primary" style={{flex:1,height:54,fontSize:'1.05rem',borderRadius:'var(--radius-md)',boxShadow:'var(--glow)'}} onClick={handleAddCart}>
                <ShoppingCart size={20}/> Thêm vào giỏ hàng
              </button>
            </div>
          )}

          <div style={{display:'flex',gap:12,marginBottom:28}}>
            <button className="btn btn-outline" onClick={handleWishlist}
              style={{...(wishlisted?{borderColor:'var(--red)',color:'var(--red)',background:'rgba(239,68,68,0.08)'}:{}), flex:1, height:46, fontSize:'0.95rem'}}>
              <Heart size={16} fill={wishlisted?'#ef4444':'none'} stroke={wishlisted?'#ef4444':'currentColor'}/> {wishlisted?'Đã thích':'Yêu thích'}
            </button>
            <button
              className={`btn ${isInCompare(product.id) ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex:1, height:46, fontSize:'0.95rem' }}
              onClick={() => addToCompare({
                id: product.id, slug: product.slug, name: product.name,
                thumbnail: product.thumbnail, price: product.price,
                sale_price: product.sale_price, brand_name: product.brand_name,
                avg_rating: product.avg_rating, stock_quantity: product.stock_quantity,
              })}
            >
              <BarChart2 size={16}/> {isInCompare(product.id) ? 'Đang so sánh' : 'So sánh'}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,padding:16,background:'var(--surface-2)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)'}}>
            {['🔒 Thanh toán bảo mật','🚚 Giao trong 2-3 ngày','✅ Hàng chính hãng 100%','🔄 Đổi trả 15 ngày'].map(b=>(
              <div key={b} style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{marginBottom:32}}>
        <div className="card-body">
          <div className="tabs">
            {[{k:'specs',l:'Thông số kỹ thuật'},{k:'desc',l:'Mô tả sản phẩm'},{k:'reviews',l:`Đánh giá (${product.reviews?.length||0})`}].map(t => (
              <div key={t.k} className={`tab ${activeTab===t.k?'active':''}`} onClick={()=>setActiveTab(t.k)}>{t.l}</div>
            ))}
          </div>

          {activeTab==='specs' && (
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <tbody>
                {(product.specs||[]).map(s=>(
                  <tr key={s.spec_name} style={{borderBottom:'1px solid var(--border)'}}>
                    <td style={{padding:'10px 4px',color:'var(--text-muted)',fontSize:'0.88rem',width:'35%',fontWeight:600}}>{s.spec_name}</td>
                    <td style={{padding:'10px 4px',color:'var(--text-primary)',fontSize:'0.88rem'}}>{s.spec_value}{s.unit?` ${s.unit}`:''}</td>
                  </tr>
                ))}
                {!product.specs?.length && <tr><td colSpan={2} style={{padding:20,color:'var(--text-muted)',textAlign:'center'}}>Chưa có thông số kỹ thuật</td></tr>}
              </tbody>
            </table>
          )}

          {activeTab==='desc' && (
            <div style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'0.9rem',whiteSpace:'pre-wrap'}}>{product.description||'Chưa có mô tả chi tiết.'}</div>
          )}

          {activeTab==='reviews' && (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {!product.reviews?.length
                ? <div style={{color:'var(--text-muted)',textAlign:'center',padding:24}}>Chưa có đánh giá nào</div>
                : product.reviews.map(r=>(
                  <div key={r.id} style={{padding:'14px 0',borderBottom:'1px solid var(--border)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'var(--accent-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'var(--accent)'}}>{r.user_name?.charAt(0)}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:'0.88rem'}}>{r.user_name}</div>
                        <div className="stars">{[1,2,3,4,5].map(s=><Star key={s} size={11} fill={s<=r.rating?'var(--amber)':'none'} color={s<=r.rating?'var(--amber)':'var(--surface-3)'}/>)}</div>
                      </div>
                      <span style={{marginLeft:'auto',fontSize:'0.75rem',color:'var(--text-muted)'}}>{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {r.comment && <p style={{fontSize:'0.88rem',color:'var(--text-secondary)',lineHeight:1.6}}>{r.comment}</p>}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.related?.length > 0 && (
        <div>
          <h2 className="section-title" style={{marginBottom:20}}>Sản phẩm liên quan</h2>
          <div className="products-grid">
            {product.related.slice(0,4).map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      )}
    </div></div>
  );
}
