export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-[480px] w-[90%] sm:w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 relative z-10">
        {children}
      </div>
    </div>
  );
}
