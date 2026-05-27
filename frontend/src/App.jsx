import { useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import {
  getPostLoginRoute,
  getStoredUser,
  hasRole,
  isAuthenticated,
  subscribeToSessionExpired,
} from "./lib/auth";
import { showToast } from "./lib/toast";
import { ToastViewport } from "./components/ui/ToastViewport";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Otp from "./pages/auth/Otp";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import PCBuilder from "./pages/PCBuilder";
import Promotions from "./pages/Promotions";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetail from "./pages/OrderDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminSupport from "./pages/admin/AdminSupport";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
}

function SessionExpiredHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return subscribeToSessionExpired(() => {
      showToast({
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        type: "error",
      });

      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: { redirectedFrom: location.pathname },
        });
      }
    });
  }, [location.pathname, navigate]);

  return null;
}

function RequireAuth({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFrom: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}

function PublicOnly({ children }) {
  if (!isAuthenticated()) {
    return children;
  }

  const user = getStoredUser();
  return <Navigate to={getPostLoginRoute(user?.role)} replace />;
}

function RequireRole({ roles, fallbackTo = "/", children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFrom: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!hasRole(...roles)) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionExpiredHandler />
      <ToastViewport />

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/otp" element={<PublicOnly><Otp /></PublicOnly>} />

        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
        <Route path="/product/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><SearchResults /></RequireAuth>} />
        <Route path="/pc-builder" element={<RequireAuth><PCBuilder /></RequireAuth>} />
        <Route path="/promotions" element={<RequireAuth><Promotions /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><UserProfile section="profile" /></RequireAuth>} />
        <Route path="/profile/orders" element={<RequireAuth><UserProfile section="orders" /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/order-confirmation" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
        <Route path="/order-details" element={<RequireAuth><OrderDetail /></RequireAuth>} />
        <Route path="/order/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminDashboard /></RequireRole>} />
        <Route path="/admin/brands" element={<RequireRole roles={["admin"]} fallbackTo="/admin"><AdminBrands /></RequireRole>} />
        <Route path="/admin/categories" element={<RequireRole roles={["admin"]} fallbackTo="/admin"><AdminCategories /></RequireRole>} />
        <Route path="/admin/vouchers" element={<RequireRole roles={["admin"]} fallbackTo="/admin"><AdminVouchers /></RequireRole>} />
        <Route path="/admin/accounts" element={<RequireRole roles={["admin"]} fallbackTo="/admin"><AdminAccounts /></RequireRole>} />
        <Route path="/admin/customers" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminCustomers /></RequireRole>} />
        <Route path="/admin/products" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminProducts /></RequireRole>} />
        <Route path="/admin/orders" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminOrders /></RequireRole>} />
        <Route path="/admin/shipping" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminShipping /></RequireRole>} />
        <Route path="/admin/support" element={<RequireRole roles={["admin", "staff"]} fallbackTo="/"><AdminSupport /></RequireRole>} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
