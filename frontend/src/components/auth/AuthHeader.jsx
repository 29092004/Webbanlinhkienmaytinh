export function AuthHeader({ title }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-[36px] font-extrabold text-[#0052cc] uppercase tracking-tight mb-1">
        EXO CORE
      </h1>
      <p className="text-sm font-medium text-gray-500 mb-8">
        Hệ thống máy tính hiệu năng cao
      </p>
      <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}
