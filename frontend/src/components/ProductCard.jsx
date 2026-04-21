import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BarChart2, ShoppingCart, Star, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { wishlistApi } from '../api';
import toast from 'react-hot-toast';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const calcDiscount = (price, salePrice) =>
  salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

export default function ProductCard({ product, wishlistIds = [], onWishlistToggle }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();

  // Local wishlist state — starts from parent's wishlistIds prop
  const [isWished, setIsWished] = useState(() => wishlistIds.includes(product.id));
  const [wishLoading, setWishLoading] = useState(false);

  const inCompare = isInCompare(product.id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Vui lòng đăng nhập!'); return; }
    if (wishLoading) return;

    // Optimistic update: toggle immediately
    const nextWished = !isWished;
    setIsWished(nextWished);
    setWishLoading(true);

    try {
      const res = await wishlistApi.toggle(product.id);
      toast.success(res.data.message);
      // Notify parent to sync its wishlistIds
      if (onWishlistToggle) onWishlistToggle(product.id, nextWished);
    } catch {
      // Revert on error
      setIsWished(!nextWished);
      toast.error('Có lỗi xảy ra!');
    } finally {
      setWishLoading(false);
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Vui lòng đăng nhập!'); return; }
    try {
      await addToCart(product.id, 1);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ!');
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare({
      id:             product.id,
      slug:           product.slug,
      name:           product.name,
      thumbnail:      product.thumbnail,
      price:          product.price,
      sale_price:     product.sale_price,
      brand_name:     product.brand_name,
      avg_rating:     product.avg_rating,
      stock_quantity: product.stock_quantity,
    });
  };

  const discountPct  = calcDiscount(product.price, product.sale_price);
  const displayPrice = product.sale_price || product.price;

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.thumbnail || ''}
          alt={product.name}
          className="product-card__img"
          onError={e => {
            e.target.src = `https://placehold.co/300x225/0F172A/3B82F6?text=${encodeURIComponent('TechStore')}`;
          }}
        />

        {/* Hover overlay: Xem chi tiết */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,23,42,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.22s ease',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          zIndex: 3,
        }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            background: 'rgba(59,130,246,0.85)',
            padding: '8px 18px', borderRadius: 999,
            backdropFilter: 'blur(4px)',
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 0.22s ease',
          }}>
            <Eye size={15} /> Xem chi tiết
          </span>
        </div>

        {/* Badges */}
        <div className="product-card__badges">
          {discountPct > 0 && <span className="badge badge-sale">-{discountPct}%</span>}
          {product.is_featured
            ? <span className="badge badge-featured">Hot</span>
            : product.stock_quantity === 0 && <span className="badge" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>Hết hàng</span>
          }
        </div>

        {/* Action buttons */}
        <div className="product-card__actions">
          {/* Wishlist / Heart */}
          <button
            className={`product-card__action-btn ${isWished ? 'active' : ''}`}
            onClick={handleWishlist}
            title={isWished ? 'Bỏ yêu thích' : 'Yêu thích'}
            disabled={wishLoading}
            style={{
              color:      isWished ? '#ef4444' : undefined,
              background: isWished ? 'rgba(239,68,68,0.15)' : undefined,
              transform:  wishLoading ? 'scale(0.85)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            <Heart
              size={15}
              fill={isWished ? '#ef4444' : 'none'}
              stroke={isWished ? '#ef4444' : 'currentColor'}
            />
          </button>

          {/* Compare */}
          <button
            className={`product-card__action-btn ${inCompare ? 'active' : ''}`}
            onClick={handleCompare}
            title={inCompare ? 'Đã thêm vào so sánh' : 'So sánh'}
            style={inCompare ? { color: 'var(--accent)', background: 'rgba(59,130,246,0.18)' } : {}}
          >
            <BarChart2 size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card__body">
        <div className="product-card__info">
          <div className="product-card__brand">{product.brand_name}</div>
          <div className="product-card__name">{product.name}</div>

          {product.avg_rating > 0 && (
            <div className="product-card__rating">
              <Star size={12} fill="currentColor" />
              {Number(product.avg_rating).toFixed(1)}
              {product.review_count && <span>({product.review_count})</span>}
            </div>
          )}

          <div className="product-card__price">
            <span className={product.sale_price ? 'price-sale' : 'price-current'}>
              {formatPrice(displayPrice)}
            </span>
            {product.sale_price && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary btn-full btn-sm product-card__cart-btn"
          onClick={handleAddCart}
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart size={14} />
          {product.stock_quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
}
