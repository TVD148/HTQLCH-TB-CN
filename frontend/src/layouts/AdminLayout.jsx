import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, Shield, BarChart2, Archive, FolderOpen, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin',            icon: <LayoutDashboard size={16}/>, label: 'Dashboard',    exact: true },
  { to: '/admin/products',   icon: <Package size={16}/>,         label: 'Sản phẩm' },
  { to: '/admin/categories', icon: <FolderOpen size={16}/>,      label: 'Danh mục' },
  { to: '/admin/orders',     icon: <ShoppingBag size={16}/>,     label: 'Đơn hàng' },
  { to: '/admin/vouchers',   icon: <Tag size={16}/>,             label: 'Voucher' },
  { to: '/admin/users',      icon: <Users size={16}/>,           label: 'Khách hàng' },
  { to: '/admin/warranty',   icon: <Shield size={16}/>,          label: 'Bảo hành' },
  { to: '/admin/inventory',  icon: <Archive size={16}/>,         label: 'Kho hàng' },
  { to: '/admin/reports',    icon: <BarChart2 size={16}/>,       label: 'Báo cáo' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="header__logo-icon" style={{width:30,height:30}}><Zap size={15} color="#fff"/></div>
            <div>
              <div style={{lineHeight:1}}>TechStore</div>
              <div style={{fontSize:'0.7rem',color:'var(--text-muted)',fontWeight:400}}>Quản trị</div>
            </div>
          </div>
        </div>

        <nav>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({isActive}) => `admin-nav-item${isActive?' active':''}`}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{borderTop:'1px solid var(--border)',padding:'16px 20px',marginTop:'auto',position:'absolute',bottom:0,left:0,right:0}}>
          <div style={{fontSize:'0.8rem',fontWeight:600,marginBottom:4}}>{user?.name}</div>
          <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:10}}>{user?.role}</div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'flex-start',color:'var(--red)'}}>
            <LogOut size={14}/> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
