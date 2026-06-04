import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import {
  getPostLoginRoute,
  getStoredUser,
  isAuthenticated,
  subscribeToSessionExpired,
} from "./lib/auth";
import { showToast } from "./lib/toast";
import { ToastViewport } from "./components/ui/ToastViewport";
import { SupportChatWidget } from "./components/support/SupportChatWidget";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Otp = lazy(() => import("./pages/auth/Otp"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const PCBuilder = lazy(() => import("./pages/PCBuilder"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Compare = lazy(() => import("./pages/Compare"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminVouchers = lazy(() => import("./pages/admin/AdminVouchers"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminShipping = lazy(() => import("./pages/admin/AdminShipping"));
const AdminAccounts = lazy(() => import("./pages/admin/AdminAccounts"));
const AdminSupport = lazy(() => import("./pages/admin/AdminSupport"));

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

function AdminAreaGuard({ adminOnly = false, children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFrom: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!user || !["admin", "staff"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-center text-sm font-semibold text-slate-500">
      Đang tải trang...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionExpiredHandler />
      <ToastViewport />
      <SupportChatWidget />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/otp" element={<PublicOnly><Otp /></PublicOnly>} />

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/pc-builder" element={<PCBuilder />} />
          <Route path="/profile" element={<RequireAuth><UserProfile section="profile" /></RequireAuth>} />
          <Route path="/profile/orders" element={<RequireAuth><UserProfile section="orders" /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/order-confirmation" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
          <Route path="/order-details" element={<RequireAuth><OrderDetail /></RequireAuth>} />
          <Route path="/order/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAreaGuard><AdminDashboard /></AdminAreaGuard>} />
          <Route path="/admin/brands" element={<AdminAreaGuard adminOnly><AdminBrands /></AdminAreaGuard>} />
          <Route path="/admin/categories" element={<AdminAreaGuard adminOnly><AdminCategories /></AdminAreaGuard>} />
          <Route path="/admin/vouchers" element={<AdminAreaGuard adminOnly><AdminVouchers /></AdminAreaGuard>} />
          <Route path="/admin/accounts" element={<AdminAreaGuard adminOnly><AdminAccounts /></AdminAreaGuard>} />
          <Route path="/admin/customers" element={<AdminAreaGuard><AdminCustomers /></AdminAreaGuard>} />
          <Route path="/admin/products" element={<AdminAreaGuard><AdminProducts /></AdminAreaGuard>} />
          <Route path="/admin/orders" element={<AdminAreaGuard><AdminOrders /></AdminAreaGuard>} />
          <Route path="/admin/shipping" element={<AdminAreaGuard><AdminShipping /></AdminAreaGuard>} />
          <Route path="/admin/support" element={<AdminAreaGuard><AdminSupport /></AdminAreaGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>

    </BrowserRouter>
  );
}

export default App;
