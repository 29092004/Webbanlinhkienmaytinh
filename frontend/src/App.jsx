import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { subscribeToSessionExpired } from "./lib/auth";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Otp from "./pages/auth/Otp";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import PCBuilder from "./pages/PCBuilder";
import Promotions from "./pages/Promotions";
import News from "./pages/News";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetail from "./pages/OrderDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminAccounts from "./pages/admin/AdminAccounts";

function SessionExpiredHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return subscribeToSessionExpired(() => {
      window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.");

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

function App() {
  return (
    <BrowserRouter>
      <SessionExpiredHandler />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pc-builder" element={<PCBuilder />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<UserProfile section="profile" />} />
        <Route path="/profile/orders" element={<UserProfile section="orders" />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-details" element={<OrderDetail />} />
        <Route path="/order/:id" element={<OrderDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/brands" element={<AdminBrands />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/vouchers" element={<AdminVouchers />} />
        <Route path="/admin/accounts" element={<AdminAccounts />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/shipping" element={<AdminShipping />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
