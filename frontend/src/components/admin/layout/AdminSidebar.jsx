import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, LogOut, Grid, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Tổng quan", path: "/admin" },
    { icon: <Package className="w-5 h-5" />, label: "Sản phẩm", path: "/admin/products" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Đơn hàng", path: "/admin/orders" },
    { icon: <Users className="w-5 h-5" />, label: "Người dùng", path: "/admin/customers" },
    { icon: <Layers className="w-5 h-5" />, label: "Danh mục", path: "/admin/categories" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Thống kê", path: "/admin/reports" },
    { icon: <Settings className="w-5 h-5" />, label: "Cài đặt", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-gray-400 flex flex-col h-screen fixed top-0 left-0 z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
          <Grid className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-white tracking-tight text-2xl leading-none mb-1">Admin</h1>
          <span className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-bold">LINHKIENMAYTINH</span>
        </div>
      </div>

      <div className="flex-grow px-4 py-4 overflow-y-auto">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const isActive = currentPath === item.path || (item.path !== "/admin" && currentPath.startsWith(item.path));
            
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]' 
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <div className="p-1.5 border border-gray-700 rounded-lg group-hover:border-white/20 transition-colors">
            <LogOut className="w-4 h-4 rotate-180" />
          </div>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
