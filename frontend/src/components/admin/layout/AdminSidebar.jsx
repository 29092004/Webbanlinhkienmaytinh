import {
  BadgeCheck,
  BadgePercent,
  Boxes,
  Headset,
  Home,
  Layers,
  LogOut,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession, getStoredUser } from "@/lib/auth";
import { api } from "@/lib/api";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Trang chủ", path: "/admin" },
    { icon: <Package className="w-5 h-5" />, label: "Trang sản phẩm", path: "/admin/products" },
    { icon: <Layers className="w-5 h-5" />, label: "Danh mục", path: "/admin/categories", adminOnly: true },
    { icon: <BadgePercent className="w-5 h-5" />, label: "Thương hiệu", path: "/admin/brands", adminOnly: true },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Đơn hàng", path: "/admin/orders" },
    { icon: <Tag className="w-5 h-5" />, label: "Khuyến mãi", path: "/admin/vouchers", adminOnly: true },
    { icon: <BadgeCheck className="w-5 h-5" />, label: "Tài khoản", path: "/admin/accounts", adminOnly: true },
    { icon: <Users className="w-5 h-5" />, label: "Người dùng", path: "/admin/customers" },
    { icon: <Boxes className="w-5 h-5" />, label: "Vận chuyển", path: "/admin/shipping" },
    { icon: <Headset className="w-5 h-5" />, label: "Hỗ trợ Chat", path: "/admin/support" },
  ].filter((item) => (item.adminOnly ? isAdmin : true));

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Always clear client session even if logout request fails.
    }

    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[290px] flex-col border-r border-[#d9e2ef] bg-[#f5f8fc]">
      <div className="bg-[#151d33] px-6 py-4 text-white">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-white/16 text-[0.95rem] font-bold">
            A
          </div>
          <div className="min-w-0">
            <div className="truncate text-[0.9rem] font-bold leading-none">
              {isAdmin ? "Admin" : "Nhân viên"}
            </div>
            <p className="mt-1 truncate text-[0.7rem] text-slate-200">
              {currentUser?.username || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 py-4">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const isActive = currentPath === item.path || (item.path !== "/admin" && currentPath.startsWith(item.path));

            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.82rem] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e7ecf4] text-slate-950"
                    : "text-slate-950 hover:bg-[#edf2f8]"
                }`}
              >
                <span className={isActive ? "text-slate-800" : "text-slate-700"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#d9e2ef] px-4 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[0.82rem] font-medium text-[#ff2020] transition hover:bg-[#fff1f1]"
        >
          <LogOut className="h-4 w-4 rotate-180 text-[#ff2020]" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
