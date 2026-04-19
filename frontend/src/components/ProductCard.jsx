import { Link, useNavigate } from 'react-router-dom';
import { Heart, BarChart2, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistApi } from '../api';
import toast from 'react-hot-toast';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const calcDiscount = (price, salePrice) =>
  salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

export default function ProductCard({ product, wishlistIds = [] }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isWished = wishlistIds.includes(product.id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Vui lòng đăng nhập!'); return; }
    try {
      const res = await wishlistApi.toggle(product.id);
      toast.success(res.data.message);
    } catch { toast.error('Có lỗi xảy ra!'); }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Vui lòng đăng nhập!'); return; }
    try {
      await addToCart(product.id, 1);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ!');
    }
  };

  const discountPct = calcDiscount(product.price, product.sale_price);
  const displayPrice = product.sale_price || product.price;

  return (
    <Link to={`/shop/${product.slug}`} className="product-card">
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.thumbnail || ''}
          alt={product.name}
          className="product-card__img"
          onError={e => {
            // Fallback to a clean colored placeholder
            e.target.src = `https://placehold.co/300x225/0F172A/3B82F6?text=${encodeURIComponent('TechStore')}`;
          }}
        />

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
          <button
            className={`product-card__action-btn ${isWished ? 'active' : ''}`}
            onClick={handleWishlist}
            title="Yêu thích"
          >
            <Heart size={15} fill={isWished ? 'currentColor' : 'none'} />
          </button>
          {/* So sánh — dùng button+navigate thay vì Link lồng trong Link */}
          <button
            className="product-card__action-btn"
            onClick={e => { e.preventDefault(); navigate(`/compare?ids=${product.slug}`); }}
            title="So sánh"
          >
            <BarChart2 size={15} />
          </button>
        </div>
      </div>

      {/* Body — flex column, nút luôn ở đáy */}
      <div className="product-card__body">
        {/* Top info block */}
        <div className="product-card__info">
          <div className="product-card__brand">{product.brand_name}</div>
          <div className="product-card__name">{product.name}</div>

          {/* Rating */}
          {product.avg_rating > 0 && (
            <div className="product-card__rating">
              <Star size={12} fill="currentColor" />
              {Number(product.avg_rating).toFixed(1)}
              {product.review_count && <span>({product.review_count})</span>}
            </div>
          )}

          {/* Price */}
          <div className="product-card__price">
            <span className={product.sale_price ? 'price-sale' : 'price-current'}>
              {formatPrice(displayPrice)}
            </span>
            {product.sale_price && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        {/* Button — luôn ở đáy nhờ margin-top: auto */}
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
