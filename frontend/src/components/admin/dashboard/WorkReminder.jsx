export function WorkReminder() {
  return (
    <div className="bg-[#0f172a] rounded-2xl p-6 shadow-lg shadow-blue-900/10 text-white relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-[14px] font-bold mb-3 tracking-wide">Lời nhắc công việc</h3>
        <p className="text-[12px] text-gray-400 mb-6 leading-relaxed">
          Bạn có <span className="text-blue-400 font-bold">3 đơn hàng</span> cần xác nhận và <span className="text-blue-400 font-bold">1 yêu cầu</span> nhập kho mới.
        </p>
        
        <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[12px] font-bold transition-all duration-300">
          Xem chi tiết
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full -ml-12 -mb-12 blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
    </div>
  );
}
