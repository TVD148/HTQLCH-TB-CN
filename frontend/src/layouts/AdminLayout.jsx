import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Package, ShoppingBag, Tag, Users, Shield, BarChart2,
  Archive, FolderOpen, Zap, LogOut, Bell, ExternalLink,
  MessageSquare, ChevronDown, Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Cấu hình nav ────────────────────────────────────────────
// type: 'link' | 'group'
// group chỉ hiện với admin, items bên trong dùng roles
const NAV_CONFIG = [
  // Nhóm "Nhân viên" — gom lại khi admin xem
  {
    type: 'group',
    label: 'Nhân viên',
    icon: <Wrench size={15} />,
    adminOnly: true,          // nhóm này chỉ gom khi là admin
    items: [
      { to: '/admin/orders',     icon: <ShoppingBag size={15}/>, label: 'Đơn hàng' },
      { to: '/admin/flash-sale', icon: <Zap size={15} color="var(--amber)"/>, label: 'Flash Sale' },
      { to: '/admin/warranty',   icon: <Shield size={15}/>,      label: 'Bảo hành' },
    ],
  },
  // Admin-only links
  { type: 'link', to: '/admin/products',      icon: <Package size={15}/>,      label: 'Sản phẩm',    roles: ['admin'] },
  { type: 'link', to: '/admin/categories',    icon: <FolderOpen size={15}/>,   label: 'Danh mục',    roles: ['admin'] },
  { type: 'link', to: '/admin/brands',        icon: <Tag size={15}/>,          label: 'Thương hiệu', roles: ['admin'] },
  { type: 'link', to: '/admin/vouchers',      icon: <Tag size={15}/>,          label: 'Voucher',     roles: ['admin'] },
  { type: 'link', to: '/admin/reviews',       icon: <MessageSquare size={15}/>,label: 'Đánh giá',    roles: ['admin'] },
  { type: 'link', to: '/admin/users',         icon: <Users size={15}/>,        label: 'Khách hàng',  roles: ['admin'] },
  { type: 'link', to: '/admin/inventory',     icon: <Archive size={15}/>,      label: 'Kho hàng',    roles: ['admin'] },
  { type: 'link', to: '/admin/reports',       icon: <BarChart2 size={15}/>,    label: 'Báo cáo',     roles: ['admin'] },
  { type: 'link', to: '/admin/notifications', icon: <Bell size={15}/>,         label: 'Thông báo',   roles: ['admin'] },
];

// Khi là staff: show riêng từng link (không gom nhóm)
const STAFF_NAV = [
  { to: '/admin/orders',     icon: <ShoppingBag size={15}/>, label: 'Đơn hàng' },
  { to: '/admin/flash-sale', icon: <Zap size={15} color="var(--amber)"/>, label: 'Flash Sale' },
  { to: '/admin/warranty',   icon: <Shield size={15}/>,      label: 'Bảo hành' },
];

const ROLE_LABEL = { admin: 'Quản trị viên', staff: 'Nhân viên' };

// NavLink đơn giản
function NavItem({ to, icon, label, indent = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
      style={indent ? { paddingLeft: 36 } : {}}
    >
      {icon} {label}
    </NavLink>
  );
}

// Nhóm có thể thu gọn — tự mở nếu 1 item trong nhóm đang active
function NavGroup({ label, icon, items }) {
  const location = useLocation();
  const isAnyActive = items.some(it => location.pathname.startsWith(it.to));
  const [open, setOpen] = useState(isAnyActive);

  return (
    <div>
      {/* Header nhóm */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 20px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: isAnyActive ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: '0.83rem', fontWeight: 600,
          borderLeft: isAnyActive ? '3px solid var(--accent)' : '3px solid transparent',
          transition: 'all .15s',
        }}
        onMouseEnter={e => { if (!isAnyActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { if (!isAnyActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <span style={{ opacity: 0.8 }}>{icon}</span>
        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        {/* Badge đánh dấu số mục */}
        <span style={{
          fontSize: '0.65rem', background: 'var(--surface-3)',
          borderRadius: 99, padding: '1px 6px', color: 'var(--text-muted)',
        }}>
          {items.length}
        </span>
        <ChevronDown
          size={13}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform .2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Items bên trong */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? `${items.length * 44}px` : '0',
        transition: 'max-height .25s ease',
      }}>
        {/* Đường kẻ dọc trái */}
        <div style={{ borderLeft: '1px solid var(--border)', marginLeft: 28, paddingLeft: 4 }}>
          {items.map(it => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              style={{ paddingLeft: 16, fontSize: '0.82rem' }}
            >
              {it.icon} {it.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="header__logo-icon" style={{ width: 30, height: 30 }}>
              <Zap size={15} color="#fff" />
            </div>
            <div>
              <div style={{ lineHeight: 1 }}>TechStore</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                {ROLE_LABEL[user?.role] || 'Quản trị'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ overflowY: 'auto', flex: 1, paddingBottom: 130 }}>
          {isAdmin ? (
            // ── Admin: nhóm staff + admin-only links ──
            <>
              {NAV_CONFIG.map((item, i) => {
                if (item.type === 'group') {
                  return <NavGroup key={i} label={item.label} icon={item.icon} items={item.items} />;
                }
                // link admin-only
                if (item.roles && !item.roles.includes(user?.role)) return null;
                return <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />;
              })}
            </>
          ) : (
            // ── Staff: hiện thẳng 3 link ──
            <>
              {STAFF_NAV.map(it => (
                <NavItem key={it.to} to={it.to} icon={it.icon} label={it.label} />
              ))}
            </>
          )}
        </nav>

        {/* Footer user info */}
        <div style={{
          borderTop: '1px solid var(--border)', padding: '14px 20px',
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'var(--surface-1)',
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 2 }}>{user?.name}</div>
          <div style={{
            fontSize: '0.72rem', marginBottom: 10, fontWeight: 600,
            color: isAdmin ? 'var(--accent)' : 'var(--amber)',
          }}>
            {ROLE_LABEL[user?.role] || user?.role}
          </div>
          <button onClick={() => navigate('/')} className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6 }}>
            <ExternalLink size={14} /> Quay lại website
          </button>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--red)' }}>
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
