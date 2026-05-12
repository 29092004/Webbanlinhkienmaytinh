export function InputField({ label, icon: Icon, type = "text", placeholder, extraLabel }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest">
          {label}
        </label>
        {extraLabel}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <input 
          type={type} 
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded bg-[#f8f9fa] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-colors text-sm font-medium tracking-widest" 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
