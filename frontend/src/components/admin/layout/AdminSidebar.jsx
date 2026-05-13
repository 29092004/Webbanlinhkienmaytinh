import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, Rocket, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin" },
    { icon: <Package className="w-5 h-5" />, label: "Products", path: "/admin/products" },
    { icon: <Layers className="w-5 h-5" />, label: "Categories", path: "/admin/categories" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Orders", path: "/admin/orders" },
    { icon: <Users className="w-5 h-5" />, label: "Customers", path: "/admin/customers" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Reports", path: "/admin/reports" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-[#fafafa] flex flex-col h-screen fixed top-0 left-0 border-r border-gray-100 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Rocket className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-gray-900 tracking-tight text-xl">EXO CORE</span>
      </div>

      <div className="flex-grow px-4 py-6">
        <div className="text-[10px] font-bold text-gray-400 mb-4 px-4 uppercase tracking-wider">Main Menu</div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const isActive = currentPath === item.path || (item.path !== "/admin" && currentPath.startsWith(item.path));
            
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-[#111827] rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-300">System Status</span>
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>CPU LOAD</span>
              <span>24%</span>
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[24%]"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>API HEALTH</span>
              <span>99.9%</span>
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full w-[99.9%]"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
