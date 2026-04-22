import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Bell, Search, Zap, User, LogOut, Package, Shield,
         ChevronDown, Sun, Moon, Menu, X, LayoutGrid, Ticket, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, notificationApi, wishlistApi, productApi } from '../api';

export default function Header() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch]       = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCatMenu, setShowCatMenu]   = useState(false);
  const [categories, setCategories]      = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [bounce, setBounce]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const menuRef    = useRef(null);
  const catMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const searchRef  = useRef(null);
  const initialMount = useRef(true);
  const searchTimer = useRef(null);

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
  const loadNotifs = () => {
    if (user) {
      notificationApi.getAll().then(r => {
        setNotifications(r.data.data || []);
        setNotifCount(r.data.unread || 0);
      }).catch(() => {});
    }
  };
  useEffect(() => { loadNotifs(); }, [user]);

  const handleNotifClick = async (n) => {
    if (!n.is_read) {
      await notificationApi.markRead(n.id).catch(() => {});
      loadNotifs();
    }
    setShowNotifMenu(false);

    if (n.type === 'don_hang' || n.type === 'order') {
      if (n.ref_id) navigate(`/orders/${n.ref_id}`);
      else navigate('/profile?tab=orders');
    } else if (n.type === 'bao_hanh' || n.type === 'warranty') {
      navigate('/warranty');
    } else if (n.type === 'voucher' || n.type === 'su_kien') {
      navigate('/profile?tab=vouchers');
    } else if (n.type === 'danh_gia') {
      // ref_id chứa link đầy đủ: /products/:slug?tab=reviews#review-:id
      if (n.ref_id && n.ref_id.startsWith('/products/')) {
        navigate(n.ref_id);
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/profile');
    }
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllRead();
    loadNotifs();
  };

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) setShowCatMenu(false);
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) setShowNotifMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search debounce
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!search.trim()) { setSearchResults([]); setShowSearchDrop(false); return; }
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const r = await productApi.getAll({ search: search.trim(), limit: 4 });
        setSearchResults(r.data.data || []);
        setShowSearchDrop(true);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 280);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

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
    if (search.trim()) {
      setShowSearchDrop(false);
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleSearchSelect = (slug) => {
    setShowSearchDrop(false);
    setSearch('');
    navigate(`/shop/${slug}`);
  };

  const handleViewAll = () => {
    setShowSearchDrop(false);
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
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
          <div className="header-v2__search-wrap" ref={searchRef}>
            <form className="header-v2__search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm laptop, chuột, màn hình..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && searchResults.length > 0 && setShowSearchDrop(true)}
                autoComplete="off"
              />
              <button type="submit" className="header-v2__search-btn">
                <Search size={16} />
              </button>
            </form>

            {/* Live Search Dropdown */}
            {showSearchDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                zIndex: 1000, overflow: 'hidden',
              }}>
                {searchLoading ? (
                  <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đang tìm...</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Không tìm thấy sản phẩm nào</div>
                ) : (
                  <>
                    {searchResults.map(p => {
                      const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + '₫';
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSearchSelect(p.slug)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <img src={p.thumbnail} alt={p.name}
                            style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6, background: 'var(--surface-3)', flexShrink: 0 }}
                            onError={e => { e.target.src = 'https://placehold.co/52x40/1E293B/3B82F6?text=IMG'; }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem' }}>{fmt(p.sale_price || p.price)}</span>
                              {p.sale_price && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'line-through' }}>{fmt(p.price)}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onClick={handleViewAll}
                      style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Xem tất cả
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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
              <div style={{ position: 'relative' }} ref={notifMenuRef}>
                <button className="header-v2__icon-btn" title="Thông báo" onClick={() => setShowNotifMenu(v => !v)}>
                  <Bell size={17} />
                  {notifCount > 0 && <span className="header-v2__badge">{notifCount}</span>}
                </button>
                {showNotifMenu && (
                  <div className="header-v2__dropdown" style={{ width: 340, right: -10, padding: 0 }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Thông báo</span>
                      {notifCount > 0 && (
                        <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Đánh dấu đã đọc</button>
                      )}
                    </div>
                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Không có thông báo nào</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} onClick={() => handleNotifClick(n)} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: n.is_read ? 'none' : 'var(--accent-light)', transition: 'background 0.2s' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, color: 'var(--text-primary)' }}>
                              {n.title}
                              {!n.is_read && <span style={{ display:'inline-block', width:8, height:8, background:'var(--red)', borderRadius:'50%', marginLeft:6 }}></span>}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 6 }}>{n.content}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString('vi-VN')}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                      { to: '/profile',                icon: <User size={14} />,    label: 'Hồ sơ của tôi' },
                      { to: '/profile?tab=orders',    icon: <Package size={14} />,  label: 'Lịch sử đơn hàng' },
                      { to: '/profile?tab=reviews',   icon: <Star size={14} />,     label: 'Đánh giá đơn hàng' },
                      { to: '/profile?tab=vouchers',  icon: <Ticket size={14} />,   label: 'Voucher của tôi' },
                      ...(isStaff ? [{ to: '/admin', icon: <Shield size={14}/>, label: user?.role === 'admin' ? '⚙️ Quản trị viên' : '🛠️ Trang nhân viên' }] : []),
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
