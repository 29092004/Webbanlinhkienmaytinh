import { Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  clearAuthSession,
  getStoredUser,
  isAuthenticated,
  subscribeToAuthState,
} from "@/lib/auth";
import { api } from "@/lib/api";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isLoggedIn: isAuthenticated(),
    user: getStoredUser(),
  });

  useEffect(() => {
    const syncAuthState = () => {
      setAuthState({
        isLoggedIn: isAuthenticated(),
        user: getStoredUser(),
      });
    };

    return subscribeToAuthState(syncAuthState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // We still clear local session even if the API request fails.
    }

    clearAuthSession();
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold uppercase tracking-wider text-gray-900">
              EXO CORE
            </Link>
            <nav className="hidden space-x-8 text-sm md:flex">
              <Link to="/" className={location.pathname === "/" ? "border-b-2 border-blue-600 pb-1 font-semibold text-blue-600" : "font-medium text-gray-500 hover:text-gray-900"}>
                Home
              </Link>
              <Link to="/products" className={location.pathname === "/products" ? "border-b-2 border-blue-600 pb-1 font-semibold text-blue-600" : "font-medium text-gray-500 hover:text-gray-900"}>
                Products
              </Link>
              <Link to="/pc-builder" className="font-medium text-gray-500 hover:text-gray-900">
                PC Builder
              </Link>
              <Link to="/promotions" className="font-medium text-gray-500 hover:text-gray-900">
                Promotions
              </Link>
              <Link to="/news" className="font-medium text-gray-500 hover:text-gray-900">
                News
              </Link>
              <Link to="/contact" className="font-medium text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6 text-gray-500">
            <button type="button" className="transition-colors hover:text-gray-900">
              <Search className="size-5" />
            </button>
            <Link to="/cart" className="relative transition-colors hover:text-gray-900">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black size-4 flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </Link>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="transition-colors hover:text-gray-900"
              >
                <User className="size-5" />
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-11 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                  {authState.isLoggedIn && authState.user?.username ? (
                    <div className="border-b border-slate-100 px-3 pb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Tài khoản
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                        {authState.user.username}
                      </p>
                    </div>
                  ) : null}

                  <div className="pt-2">
                    {authState.isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Đăng xuất
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
