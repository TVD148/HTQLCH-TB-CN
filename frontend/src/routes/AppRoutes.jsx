import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout  from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage         from '../pages/HomePage';
import ShopPage         from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage         from '../pages/CartPage';
import CheckoutPage     from '../pages/CheckoutPage';
import LoginPage        from '../pages/LoginPage';
import RegisterPage     from '../pages/RegisterPage';
import OrderDetailPage  from '../pages/OrderDetailPage';
import WishlistPage     from '../pages/WishlistPage';
import ComparePage      from '../pages/ComparePage';
import WarrantyPage     from '../pages/WarrantyPage';
import ProfilePage      from '../pages/ProfilePage';
import NotFoundPage     from '../pages/NotFoundPage';
import AboutPage        from '../pages/AboutPage';
import ContactPage      from '../pages/ContactPage';
import MyVouchersPage   from '../pages/MyVouchersPage';

// Admin Pages
import AdminDashboard   from '../pages/admin/AdminDashboard';
import AdminProducts    from '../pages/admin/AdminProducts';
import AdminOrders      from '../pages/admin/AdminOrders';
import AdminVouchers    from '../pages/admin/AdminVouchers';
import AdminUsers       from '../pages/admin/AdminUsers';
import AdminWarranty    from '../pages/admin/AdminWarranty';
import AdminReports     from '../pages/admin/AdminReports';
import AdminInventory   from '../pages/admin/AdminInventory';
import AdminCategories  from '../pages/admin/AdminCategories';
import AdminBrands      from '../pages/admin/AdminBrands';
import AdminNotifications from '../pages/admin/AdminNotifications';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'staff') return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected User Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<Navigate to="/profile?tab=orders" replace />} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/warranty" element={<ProtectedRoute><WarrantyPage /></ProtectedRoute>} />
        <Route path="/my-vouchers" element={<ProtectedRoute><MyVouchersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products"       element={<AdminProducts />} />
        <Route path="orders"         element={<AdminOrders />} />
        <Route path="vouchers"       element={<AdminVouchers />} />
        <Route path="users"          element={<AdminUsers />} />
        <Route path="warranty"       element={<AdminWarranty />} />
        <Route path="reports"        element={<AdminReports />} />
        <Route path="inventory"      element={<AdminInventory />} />
        <Route path="categories"     element={<AdminCategories />} />
        <Route path="brands"         element={<AdminBrands />} />
        <Route path="notifications"  element={<AdminNotifications />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
