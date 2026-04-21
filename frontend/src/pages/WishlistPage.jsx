import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { wishlistApi } from '../api';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    document.title = 'Yêu thích – TechStore';
    wishlistApi.getAll().then(r => {
      const data = r.data.data || [];
      setItems(data);
      // Map wishlist items to product IDs for ProductCard
      setWishlistIds(data.map(i => i.product_id));
    }).finally(() => setLoading(false));
  }, []);

  // When user un-hearts from ProductCard, remove from list
  const handleWishlistToggle = (productId, added) => {
    if (!added) {
      setItems(prev => prev.filter(i => i.product_id !== productId));
      setWishlistIds(prev => prev.filter(id => id !== productId));
    }
  };

  if (loading) return (
    <div className="section"><div className="container">
      <div className="spinner-wrap"><div className="spinner" /></div>
    </div></div>
  );

  if (!items.length) return (
    <div className="section"><div className="container">
      <div className="empty-state" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="empty-state-icon-large" style={{ color: 'var(--red)', background: 'var(--red-light)' }}>
          <Heart size={56} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Danh sách yêu thích trống</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 24 }}>Bạn chưa có món đồ công nghệ yêu thích nào. Hãy khám phá và lưu lại nhé!</p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: 40, fontSize: '1rem', boxShadow: 'var(--glow)' }}>Khám phá sản phẩm</Link>
      </div>
    </div></div>
  );

  // Convert wishlist items to product shape expected by ProductCard
  const products = items.map(i => ({
    id:             i.product_id,
    slug:           i.slug,
    name:           i.name,
    thumbnail:      i.thumbnail,
    price:          i.price,
    sale_price:     i.sale_price,
    brand_name:     i.brand_name,
    avg_rating:     i.avg_rating,
    stock_quantity: i.stock_quantity ?? 1,
    is_featured:    i.is_featured,
  }));

  return (
    <div className="section"><div className="container">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 28 }}>❤️ Yêu thích ({items.length})</h1>
      <div className="products-grid">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            wishlistIds={wishlistIds}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>
    </div></div>
  );
}
