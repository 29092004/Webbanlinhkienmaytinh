export function AuthHeader({ title }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-extrabold text-[#0052cc] uppercase tracking-wider mb-2">
        EXO CORE
      </h1>
      <p className="text-[13px] font-medium text-gray-500 mb-6">
        Hệ thống máy tính hiệu năng cao
      </p>
      <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}
