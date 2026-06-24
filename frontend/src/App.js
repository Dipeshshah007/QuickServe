import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

// Layouts
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Customer Pages
import HomePage       from './pages/customer/HomePage';
import RestaurantsPage from './pages/customer/RestaurantsPage';
import RestaurantPage from './pages/customer/RestaurantPage';
import CartPage       from './pages/customer/CartPage';
import CheckoutPage   from './pages/customer/CheckoutPage';
import OrdersPage     from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage    from './pages/customer/ProfilePage';

// Auth Pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminLayout    from './components/Admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminMenu      from './pages/admin/AdminMenu';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminUsers     from './pages/admin/AdminUsers';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '80vh' }}>{children}</main>
    <Footer />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public - Customer */}
      <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
      <Route path="/restaurants" element={<CustomerLayout><RestaurantsPage /></CustomerLayout>} />
      <Route path="/restaurants/:id" element={<CustomerLayout><RestaurantPage /></CustomerLayout>} />

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected - Customer */}
      <Route path="/cart" element={<PrivateRoute><CustomerLayout><CartPage /></CustomerLayout></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><CustomerLayout><CheckoutPage /></CustomerLayout></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><CustomerLayout><OrdersPage /></CustomerLayout></PrivateRoute>} />
      <Route path="/orders/:id" element={<PrivateRoute><CustomerLayout><OrderDetailPage /></CustomerLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><CustomerLayout><ProfilePage /></CustomerLayout></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem' },
              success: { iconTheme: { primary: '#22C55E', secondary: 'white' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: 'white' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
