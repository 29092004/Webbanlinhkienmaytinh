import { Plus } from "lucide-react";

import ComponentRow from "./ComponentRow";

export default function ComponentSelector({ parts }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm lg:rounded-r-none">
      <header className="mb-6 flex items-center gap-2">
        <h2 className="m-0 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
          Chọn linh kiện của bạn ({parts.length}/8)
        </h2>
        <span className="flex size-4 items-center justify-center rounded-full border border-slate-400 text-[10px] font-bold text-slate-500">
          ?
        </span>
      </header>

      <div className="space-y-4">
        {parts.map((part) => (
          <ComponentRow key={part.id} part={part} />
        ))}
      </div>

      <button
        type="button"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-400 bg-blue-50/30 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
      >
        <Plus className="size-4" />
        Thêm linh kiện tuỳ chọn (Fan, LED, Card mở rộng...)
      </button>
    </section>
  );
}
