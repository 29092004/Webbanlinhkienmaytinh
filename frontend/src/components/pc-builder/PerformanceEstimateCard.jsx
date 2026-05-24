import { Gauge } from "lucide-react";

const metrics = [
  { label: "Hiệu năng", value: "Rất tốt", width: "92%", color: "bg-emerald-500" },
  { label: "Đa nhiệm/Streaming", value: "Tốt", width: "70%", color: "bg-blue-500" },
];

const fpsTargets = [
  { label: "1080p (Full HD)", value: "120+ FPS", tone: "text-emerald-600" },
  { label: "1440p (2K)", value: "80+ FPS", tone: "text-blue-700" },
  { label: "4K (Ultra HD)", value: "45+ FPS", tone: "text-blue-700" },
];

export default function PerformanceEstimateCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
        <Gauge className="size-4" />
        Ước tính hiệu năng
      </h2>
      <p className="mt-4 text-sm font-medium text-slate-600">
        Hiệu năng dự kiến trong game
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {fpsTargets.map((target) => (
          <div key={target.label}>
            <p className="text-xs font-black text-slate-700">{target.label}</p>
            <p className={`mt-2 text-xl font-black ${target.tone}`}>
              {target.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 space-y-5">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>{metric.label}</span>
              <span>{metric.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${metric.color}`}
                style={{ width: metric.width }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
