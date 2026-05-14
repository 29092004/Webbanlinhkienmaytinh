import { Search, Bell } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 border-b border-gray-100">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">Tổng quan hệ thống</h2>
        <p className="text-[11px] text-gray-500 font-medium">Chào mừng trở lại, Quản trị viên.</p>
      </div>

      <div className="flex-1 max-w-lg mx-12">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-4" />
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn hàng, sản phẩm..." 
            className="w-full bg-[#f1f5f9] border-none rounded-full py-2.5 pl-11 pr-4 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <div className="text-[13px] font-bold text-gray-900 leading-none mb-1">Admin User</div>
            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Administrator</div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&h=150&auto=format&fit=crop" 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
