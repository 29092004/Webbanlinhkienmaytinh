export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-gray-100 relative overflow-hidden">
        {children}
        
        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0052cc]"></div>
      </div>
    </div>
  );
}
