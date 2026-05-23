import { Check, ShieldCheck } from "lucide-react";

const checks = [
  "Mainboard tương thích với CPU",
  "RAM tương thích với Mainboard",
  "PSU đủ công suất cho hệ thống",
  "Case đủ không gian cho linh kiện",
  "Tản nhiệt phù hợp với CPU",
  "Tất cả linh kiện hoạt động tốt với nhau",
];

export default function CompatibilityCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="m-0 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
          Kiểm tra tương thích
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          <ShieldCheck className="size-3.5" />
          Tốt
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">
        Cấu hình của bạn hoạt động hoàn hảo!
      </p>

      <ul className="mt-5 space-y-3 text-sm font-medium text-slate-700">
        {checks.map((check) => (
          <li key={check} className="flex items-center gap-3">
            <Check className="size-4 shrink-0 text-emerald-600" />
            {check}
          </li>
        ))}
      </ul>
    </section>
  );
}
