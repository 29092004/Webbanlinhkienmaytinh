import { CheckCircle2, ChevronDown } from "lucide-react";

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

export default function ComponentRow({ part }) {
  return (
    <article className="grid grid-cols-1 gap-4 md:grid-cols-[280px_minmax(0,1fr)_24px] md:items-center">
      <div className="flex items-center gap-4">
        <img
          src={part.image}
          alt={part.category}
          className="size-12 rounded-xl bg-slate-100 object-cover"
        />
        <div>
          <h3 className="m-0 text-sm font-black text-slate-950">
            {part.category}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {part.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="grid min-h-[58px] grid-cols-[minmax(0,1fr)_120px_36px] items-center rounded-lg border border-slate-200 bg-white px-4 text-left shadow-sm transition hover:border-blue-300"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">
            {part.product}
          </p>
          <p className="mt-1 truncate text-xs font-medium text-slate-500">
            {part.detail}
          </p>
        </div>
        <span className="text-right text-sm font-black text-blue-700">
          {formatCurrency(part.price)}
        </span>
        <ChevronDown className="ml-auto size-4 text-slate-700" />
      </button>

      <CheckCircle2 className="hidden size-5 text-emerald-600 md:block" />
    </article>
  );
}
