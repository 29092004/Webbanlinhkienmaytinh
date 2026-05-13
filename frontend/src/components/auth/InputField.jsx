export function InputField({ label, icon: Icon, type = "text", placeholder, extraLabel }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
          {label}
        </label>
        {extraLabel}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type={type} 
          className="block w-full h-[50px] pl-12 pr-4 border border-gray-300 rounded-xl bg-slate-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-[15px] font-medium" 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
