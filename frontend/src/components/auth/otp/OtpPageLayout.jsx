export function OtpPageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      <header className="h-16 sm:h-20 flex items-center justify-between px-5 sm:px-8 md:px-16">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
            ⚡
          </span>
          <span className="text-[17px] sm:text-[20px] leading-none font-extrabold text-blue-700 tracking-tight">
            EXO CORE
          </span>
        </div>
        <a href="#" className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          Trợ giúp
        </a>
      </header>

      <main className="flex-1 px-4 pb-6 sm:pb-10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-32 top-20 w-[640px] h-[360px] rounded-[80px] bg-gradient-to-b from-slate-200/40 to-slate-300/20 rotate-[-8deg]" />
          <div className="absolute right-10 bottom-10 w-[420px] h-[240px] rounded-[60px] bg-gradient-to-t from-slate-200/30 to-transparent rotate-[10deg]" />
        </div>
        <div className="relative z-10 w-full max-w-[520px]">{children}</div>
      </main>

      <footer className="min-h-16 border-t border-slate-200/70 px-5 sm:px-8 md:px-16 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-slate-400 font-semibold">
        <span>© 2024 EXO CORE. HIGH-PERFORMANCE COMPUTING INFRASTRUCTURE.</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="hover:text-slate-500 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-slate-500 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-slate-500 transition-colors">Liên hệ</a>
        </div>
      </footer>
    </div>
  );
}
