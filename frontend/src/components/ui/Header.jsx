import { History, LogOut, Search, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  clearAuthSession,
  getStoredUser,
  isAuthenticated,
  subscribeToAuthState,
  updateStoredUser,
} from "@/lib/auth";
import { api } from "@/lib/api";
import {
  getGuestCartCount,
  getServerCartCount,
  subscribeToCartState,
} from "@/lib/cartStore";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Xây dựng cấu hình", href: "/pc-builder" },
];

function getUserDisplayName(user) {
  const fullName = String(user?.fullName || "").trim();

  if (fullName) {
    return fullName;
  }

  const joinedName = [user?.lastName, user?.firstName].filter(Boolean).join(" ").trim();

  if (joinedName) {
    return joinedName;
  }

  return "User";
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryFromUrl = new URLSearchParams(location.search).get("q") || "";
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [cartCount, setCartCount] = useState(0);
  const [authState, setAuthState] = useState({
    isLoggedIn: isAuthenticated(),
    user: getStoredUser(),
  });
  const displayUser = authState.user || {};
  const displayName = getUserDisplayName(displayUser);

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
    if (!authState.isLoggedIn || !authState.user?.id) {
      return;
    }

    const hasDisplayName = Boolean(
      String(authState.user?.fullName || "").trim() ||
      [authState.user?.lastName, authState.user?.firstName].filter(Boolean).join(" ").trim()
    );

    if (hasDisplayName) {
      return;
    }

    let isMounted = true;

    const syncCustomerProfile = async () => {
      try {
        const response = await api.get(`/customers/${authState.user.id}`);
        const customer = response.data?.data || null;

        if (!isMounted || !customer) {
          return;
        }

        const lastName = String(customer.firstName || "").trim();
        const firstName = String(customer.lastName || "").trim();
        const fullName = [lastName, firstName].filter(Boolean).join(" ").trim();

        if (!fullName) {
          return;
        }

        updateStoredUser((current) => ({
          ...current,
          fullName,
          firstName,
          lastName,
          phone: current.phone || customer.phone || "",
        }));
      } catch (syncError) {
        console.error("Failed to sync customer display name", syncError);
      }
    };

    syncCustomerProfile();

    return () => {
      isMounted = false;
    };
  }, [authState.isLoggedIn, authState.user?.firstName, authState.user?.fullName, authState.user?.id, authState.user?.lastName]);

  useEffect(() => {
    let isMounted = true;

    const syncCartCount = async () => {
      try {
        const currentUser = getStoredUser();
        const customerId = Number(currentUser?.id || 0);

        const nextCount =
          isAuthenticated() && customerId > 0
            ? await getServerCartCount(customerId)
            : getGuestCartCount();

        if (isMounted) {
          setCartCount(nextCount);
        }
      } catch {
        if (isMounted) {
          setCartCount(0);
        }
      }
    };

    syncCartCount();

    return subscribeToCartState(() => {
      syncCartCount();
    });
  }, [authState.isLoggedIn]);

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
    const normalizedQuery = searchTerm.trim();

    if (!normalizedQuery) {
      navigate("/products");
      return;
    }

    navigate(`/products?q=${encodeURIComponent(normalizedQuery)}`);
  };

  const isNavActive = (item) => {
    if (location.pathname === item.href) return true;

    if (item.href === "/products") {
      return (
        location.pathname.startsWith("/products") ||
        location.pathname.startsWith("/product/") ||
        location.pathname === "/search"
      );
    }

    return false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_8px_18px_rgba(15,23,42,0.03)] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[78px] grid-cols-[1fr_auto] items-center gap-4 py-3 md:grid-cols-[190px_1fr_auto]">
          <Link
            to="/"
            className="text-2xl font-black uppercase tracking-normal text-slate-950"
          >
            EXO CORE
          </Link>

          <nav className="hidden items-center justify-center gap-10 text-[15px] font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`transition-colors border-b-2 py-1.5 hover:text-red-600 ${
                  isNavActive(item)
                    ? "border-red-600 text-red-600 font-semibold"
                    : "border-transparent text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-6 text-slate-900">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden h-12 w-[320px] items-center rounded-2xl border border-slate-300 bg-slate-50 px-5 transition focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 lg:flex"
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-950 outline-none placeholder:text-slate-500"
                placeholder="Tìm kiếm linh kiện..."
              />
              <button
                type="submit"
                className="text-slate-500 transition hover:text-red-600"
                aria-label="Tìm kiếm"
              >
                <Search className="size-5" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate(searchTerm.trim() ? `/products?q=${encodeURIComponent(searchTerm.trim())}` : "/products")}
              className="transition hover:text-red-600 lg:hidden"
              aria-label="Tìm kiếm"
            >
              <Search className="size-5" />
            </button>

            <Link
              to="/cart"
              className="relative flex size-9 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-red-600"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="size-4.5" strokeWidth={2.2} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 py-[3px] text-[10px] font-black leading-none text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-red-600"
                aria-label="Tài khoản"
              >
                <UserRound className="size-5" />
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white p-3 text-left text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-3 pb-4 pt-2">
                    <div className="size-11 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
                      <UserRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[18px] font-bold tracking-[-0.01em] text-slate-950">
                        {displayName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <ProfileMenuLink
                      to="/profile"
                      icon={UserRound}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </ProfileMenuLink>
                    <ProfileMenuLink
                      to="/profile/orders"
                      icon={History}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Lịch sử đơn hàng
                    </ProfileMenuLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Đăng xuất
                    </button>
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

function ProfileMenuLink({ to, icon: Icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-bold tracking-[-0.01em] text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
    >
      <Icon className="size-4" />
      {children}
    </Link>
  );
}
