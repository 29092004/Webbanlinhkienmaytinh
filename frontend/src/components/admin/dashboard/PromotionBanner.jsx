export function PromotionBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-48 group cursor-pointer shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.005]">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#0f172a]">
        <img 
          src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1000&auto=format&fit=crop" 
          alt="RTX 50 Series" 
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
      </div>

      <div className="relative h-full flex flex-col justify-center px-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Bộ sưu tập RTX 50 Series sắp ra mắt
        </h2>
        <p className="text-gray-300 text-[14px] max-w-md mb-6 font-medium leading-relaxed">
          Hãy chuẩn bị cấu hình hệ thống và cập nhật danh mục để sẵn sàng cho ngày mở bán chính thức.
        </p>
        
        <div>
          <button className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-[13px] font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95">
            Quản lý danh mục
          </button>
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
