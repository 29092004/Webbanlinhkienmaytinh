import { Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  clearAuthSession,
  getStoredUser,
  isAuthenticated,
  subscribeToAuthState,
} from "@/lib/auth";
import { api } from "@/lib/api";

const navItems = [
  { label: "Processors", href: "/products?category=processors" },
  { label: "Graphics", href: "/products?category=graphics" },
  { label: "Storage", href: "/products?category=storage" },
  { label: "Memory", href: "/products?category=memory" },
  { label: "Builds", href: "/products?category=builds" },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}`;
  const queryFromUrl = new URLSearchParams(location.search).get("q") || "RTX 4090";
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
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
      // Clear the local session even when the server request fails.
    }

    clearAuthSession();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const normalizedQuery = searchTerm.trim() || "RTX 4090";

    navigate(
      `/search?q=${encodeURIComponent(normalizedQuery)}&category=graphics`,
    );
  };

  const isNavActive = (item) => {
    if (currentPath === item.href) return true;

    return location.pathname === "/search" && item.label === "Graphics";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f7f8fa]/95 shadow-[0_8px_18px_rgba(15,23,42,0.05)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[78px] grid-cols-[1fr_auto] items-center gap-4 py-3 md:grid-cols-[190px_1fr_auto]">
          <Link
            to="/"
            className="text-2xl font-black uppercase tracking-normal text-blue-700"
          >
            EXO CORE
          </Link>

          <nav className="hidden items-center justify-center gap-9 text-sm font-medium text-slate-900 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`transition hover:text-blue-700 ${
                  isNavActive(item)
                    ? "border-b-2 border-blue-700 pb-2 font-black text-blue-700"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-6 text-slate-900">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden h-12 w-[320px] items-center rounded-2xl border border-slate-300 bg-slate-50 px-5 transition focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 lg:flex"
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-950 outline-none placeholder:text-slate-500"
                placeholder="Tìm sản phẩm"
              />
              <button
                type="submit"
                className="text-slate-500 transition hover:text-blue-700"
                aria-label="Tìm kiếm"
              >
                <Search className="size-5" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/search?q=RTX%204090&category=graphics")}
              className="transition hover:text-blue-700 lg:hidden"
              aria-label="Tìm kiếm"
            >
              <Search className="size-5" />
            </button>

            <Link
              to="/cart"
              className="transition hover:text-blue-700"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="size-5" />
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="transition hover:text-blue-700"
                aria-label="Tài khoản"
              >
                <User className="size-5" />
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-11 w-64 rounded-lg border border-slate-200 bg-white p-3 text-left text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
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
                        className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        Đăng xuất
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-50 hover:text-slate-950"
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
