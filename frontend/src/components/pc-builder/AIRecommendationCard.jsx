import { Bot, Sparkles } from "lucide-react";

export default function AIRecommendationCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
        <Sparkles className="size-4" />
        Gợi ý tối ưu từ AI
      </h2>
      <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
        Dựa trên nhu cầu: Gaming 1080p - 1440p. Bạn có thể nâng cấp lên RTX
        4060 Ti để chơi game 1440p mượt hơn.
      </p>

      <div className="mt-5 flex items-center gap-4 rounded-lg border border-slate-200 p-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Bot className="size-8 text-slate-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">Nâng cấp GPU</p>
          <p className="mt-1 text-sm font-black text-slate-950">
            RTX 4060 → RTX 4060 Ti
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              +20% FPS
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              +2GB VRAM
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-emerald-600">+2.500.000đ</p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-blue-700 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </section>
  );
}
