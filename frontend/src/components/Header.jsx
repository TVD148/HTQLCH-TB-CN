import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Bell, Search, Zap, User, LogOut, Package, Shield,
         ChevronDown, Sun, Moon, Menu, X, LayoutGrid, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, notificationApi, wishlistApi } from '../api';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch]       = useState('');
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCatMenu, setShowCatMenu]   = useState(false);
  const [categories, setCategories]      = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [bounce, setBounce]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const menuRef    = useRef(null);
  const catMenuRef = useRef(null);
  const initialMount = useRef(true);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load categories for dropdown
  useEffect(() => {
    categoryApi.getAll().then(r => setCategories(r.data.data.filter(c => !c.parent_id).slice(0, 12)))
      .catch(() => {});
  }, []);

  // Notifications
  useEffect(() => {
    if (user) notificationApi.getAll().then(r => setNotifCount(r.data.unread || 0)).catch(() => {});
  }, [user]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) setShowCatMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cart bounce
  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (cart.item_count > 0) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 400);
      return () => clearTimeout(t);
    }
  }, [cart.item_count]);

  // Wishlist count
  useEffect(() => {
    if (user) wishlistApi.getAll().then(r => setWishlistCount(r.data.data.length)).catch(() => {});
    else setWishlistCount(0);
  }, [user]);

  useEffect(() => {
    const h = () => { if (user) wishlistApi.getAll().then(r => setWishlistCount(r.data.data.length)).catch(() => {}); };
    window.addEventListener('wishlistChanged', h);
    return () => window.removeEventListener('wishlistChanged', h);
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

  const CAT_ICONS = { laptop:'💻', 'dien-thoai':'📱', 'man-hinh':'🖥️', 'phu-kien':'🖱️',
    'o-cung-ram':'💾', 'thiet-bi-mang':'📡', 'pc-may-tinh-ban':'🖥️',
    'laptop-gaming':'🎮', 'laptop-van-phong':'📋', 'laptop-do-hoa':'🎨',
    'chuot-ban-phim':'⌨️', 'tai-nghe':'🎧', default: '📦' };

  return (
    <header className={`header-v2 ${scrolled ? 'scrolled' : ''}`}>
      {/* ── ROW 1: Logo | Search | Actions ─────────────────── */}
      <div className="header-v2__top">
        <div className="container header-v2__top-inner">

          {/* Logo */}
          <Link to="/" className="header-v2__logo">
            <div className="header-v2__logo-icon"><Zap size={16} color="#fff" strokeWidth={2.5} /></div>
            <span>TechStore</span>
          </Link>

          {/* Search Bar */}
          <form className="header-v2__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm laptop, chuột, màn hình..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="header-v2__search-btn">
              <Search size={16} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="header-v2__actions">
            {/* Theme */}
            <button onClick={toggleTheme} className="header-v2__icon-btn" title="Đổi giao diện">
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="header-v2__icon-btn" title="Yêu thích">
                <Heart size={17} />
                {wishlistCount > 0 && <span className="header-v2__badge">{wishlistCount}</span>}
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <Link to="/profile" className="header-v2__icon-btn" title="Thông báo">
                <Bell size={17} />
                {notifCount > 0 && <span className="header-v2__badge">{notifCount}</span>}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className={`header-v2__cart-btn ${bounce ? 'animate-cart-bounce' : ''}`} title="Giỏ hàng">
              <ShoppingCart size={17} />
              <span>Giỏ hàng</span>
              {cart.item_count > 0 && <span className="header-v2__badge">{cart.item_count}</span>}
            </Link>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <div className="header-v2__user" onClick={() => setShowUserMenu(v => !v)}>
                  <div className="header-v2__avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <span className="header-v2__username">{user.name?.split(' ').pop()}</span>
                  <ChevronDown size={13} />
                </div>
                {showUserMenu && (
                  <div className="header-v2__dropdown">
                    <div className="header-v2__dropdown-header">
                      <div className="header-v2__dropdown-name">{user.name}</div>
                      <div className="header-v2__dropdown-email">{user.email}</div>
                      {user.loyalty_points > 0 && (
                        <div className="header-v2__dropdown-points">
                          ⭐ {user.loyalty_points} điểm tích lũy
                        </div>
                      )}
                    </div>
                    {[
                      { to: '/profile',     icon: <User size={14} />,    label: 'Hồ sơ của tôi' },
                      { to: '/orders',      icon: <Package size={14} />,  label: 'Đơn hàng' },
                      { to: '/my-vouchers', icon: <Ticket size={14} />,   label: 'Voucher của tôi' },
                      ...(isAdmin ? [{ to: '/admin', icon: null, label: '⚙️ Quản trị' }] : []),
                    ].map(item => (
                      <Link key={item.to} to={item.to} className="header-v2__dropdown-item"
                        onClick={() => setShowUserMenu(false)}>
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="header-v2__dropdown-logout">
                      <LogOut size={14} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login"    className="btn btn-ghost btn-sm">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Categories | Nav Links ───────────────────── */}
      <div className="header-v2__nav-bar">
        <div className="container header-v2__nav-inner">

          {/* Categories Dropdown */}
          <div className="header-v2__cat-wrap" ref={catMenuRef}>
            <button
              className="header-v2__cat-btn"
              onClick={() => setShowCatMenu(v => !v)}
            >
              {showCatMenu ? <X size={16} /> : <Menu size={16} />}
              <span>DANH MỤC</span>
            </button>

            {showCatMenu && (
              <div className="header-v2__cat-menu">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    className="header-v2__cat-item"
                    onClick={() => setShowCatMenu(false)}
                  >
                    <span className="header-v2__cat-icon">
                      {CAT_ICONS[cat.slug] || CAT_ICONS.default}
                    </span>
                    <span>{cat.name}</span>
                    {cat.product_count > 0 && (
                      <span className="header-v2__cat-count">{cat.product_count}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="header-v2__nav">
            <NavLink to="/"
              className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
              end
            >Trang chủ</NavLink>
            <NavLink to="/shop"
              className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
            >Sản phẩm</NavLink>
            <NavLink to="/about"
              className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
            >Giới thiệu</NavLink>
            <NavLink to="/contact"
              className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
            >Liên hệ</NavLink>
            <NavLink to="/compare"
              className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
            >So sánh</NavLink>
            {user && (
              <NavLink to="/warranty"
                className={({ isActive }) => `header-v2__nav-link${isActive ? ' active' : ''}`}
                style={({ isActive }) => isActive ? {} : {}}
              >
                <Shield size={13} style={{ display:'inline', verticalAlign:'middle', marginRight:4, marginTop:-2 }} />
                Bảo hành
              </NavLink>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
