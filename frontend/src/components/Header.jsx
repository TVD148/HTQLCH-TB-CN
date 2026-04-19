import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Bell, Search, Zap, User, LogOut, Package, Shield, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { notificationApi, wishlistApi } from '../api';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch]   = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  
  const [bounce, setBounce] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const initialMount = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      notificationApi.getAll()
        .then(r => setNotifCount(r.data.unread || 0))
        .catch(() => {});
    }
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (cart.item_count > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cart.item_count]);

  useEffect(() => {
    if (user) {
      wishlistApi.getAll().then(res => setWishlistCount(res.data.data.length)).catch(() => {});
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handler = () => { if (user) wishlistApi.getAll().then(res => setWishlistCount(res.data.data.length)).catch(() => {}); };
    window.addEventListener('wishlistChanged', handler);
    return () => window.removeEventListener('wishlistChanged', handler);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <Zap size={18} color="#fff" strokeWidth={2.5} />
          </div>
          TechStore
        </Link>

        {/* Nav links */}
        <nav className="header__nav">
          <NavLink to="/"     className={({ isActive }) => `header__nav-link${isActive ? ' active' : ''}`}>Trang chủ</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `header__nav-link${isActive ? ' active' : ''}`}>Sản phẩm</NavLink>
          <NavLink to="/shop?featured=1" className="header__nav-link">Nổi bật</NavLink>
          <NavLink to="/compare" className={({ isActive }) => `header__nav-link${isActive ? ' active' : ''}`}>So sánh</NavLink>
        </nav>

        {/* Search */}
        <div className="header__search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm laptop, chuột, màn hình..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="header__search-btn">
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="header__actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="header__icon-btn" title="Đổi giao diện">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="header__icon-btn" title="Yêu thích">
              <Heart size={18} />
              {wishlistCount > 0 && <span className="header__badge">{wishlistCount}</span>}
            </Link>
          )}

          {/* Notifications */}
          {user && (
            <Link to="/profile" className="header__icon-btn" title="Thông báo">
              <Bell size={18} />
              {notifCount > 0 && <span className="header__badge">{notifCount}</span>}
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className={`header__icon-btn ${bounce ? 'animate-cart-bounce' : ''}`} title="Giỏ hàng">
            <ShoppingCart size={18} />
            {cart.item_count > 0 && <span className="header__badge">{cart.item_count}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div className="header__user" onClick={() => setShowUserMenu(v => !v)}>
                <div className="header__avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ').pop()}
                </span>
                <ChevronDown size={14} />
              </div>
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 200,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden', zIndex: 100,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    {user.loyalty_points > 0 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--amber)', marginTop: 4 }}>
                        🎯 {user.loyalty_points} điểm tích lũy
                      </div>
                    )}
                  </div>
                  {[
                    { to: '/profile',  icon: <User size={14} />,    label: 'Hồ sơ của tôi' },
                    { to: '/orders',   icon: <Package size={14} />,  label: 'Đơn hàng' },
                    { to: '/warranty', icon: <Shield size={14} />,   label: 'Bảo hành' },
                    ...(isAdmin ? [{ to: '/admin', icon: null, label: '⚙️ Quản trị' }] : []),
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setShowUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.88rem', color: 'var(--red)', background: 'none', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer' }}
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
