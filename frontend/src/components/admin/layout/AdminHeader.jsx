import { Search, Bell, MessageSquare } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-10 border-b border-gray-100">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-gray-50/50 border border-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-gray-900 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="hover:text-gray-900 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">Marcus Thorne</div>
            <div className="text-[10px] font-bold text-blue-600 uppercase flex items-center justify-end gap-1">
              ADMIN <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            alt="Admin" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}
