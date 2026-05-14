export function AuthDivider({ label = "HOẶC" }) {
  return (
    <div className="flex items-center gap-6">
      <span className="h-px flex-1 bg-[#e1e5ec]" />
      <span className="text-[15px] font-medium leading-none text-slate-500">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#e1e5ec]" />
    </div>
  );
}
