import { Download, FileText, Headphones, Share2, ShoppingCart } from "lucide-react";

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

export default function BuildSummary({ total }) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm lg:rounded-l-none lg:border-l-0">
      <h2 className="m-0 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
        Tóm tắt cấu hình
      </h2>

      <div className="mt-7 border-b border-slate-200 pb-6">
        <p className="text-sm font-medium text-slate-600">Tổng cộng</p>
        <p className="mt-2 text-3xl font-black leading-none text-blue-700">
          {formatCurrency(total)}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Đã bao gồm VAT
        </p>
      </div>

      <div className="mt-6 space-y-5 text-sm font-medium text-slate-700">
        <SummaryLine label="Công suất dự kiến" value="~ 450W" />
        <SummaryLine label="Hiệu suất tổng thể" value="Rất tốt" accent />
        <SummaryLine label="Độ tương thích" value="100%" accent />
      </div>

      <button
        type="button"
        className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-blue-700 text-base font-black text-white shadow-sm transition hover:bg-blue-800"
      >
        <ShoppingCart className="size-5" />
        Thêm vào giỏ hàng
      </button>

      <div className="mt-4 space-y-3">
        <ActionButton icon={FileText}>Lưu cấu hình</ActionButton>
        <ActionButton icon={Share2}>Chia sẻ cấu hình</ActionButton>
        <ActionButton icon={Download}>Xuất PDF</ActionButton>
      </div>

      <div className="mt-7 flex items-center gap-4 rounded-lg bg-blue-50 p-4">
        <Headphones className="size-8 shrink-0 text-blue-700" />
        <div>
          <p className="text-sm font-black text-blue-700">Cần tư vấn thêm?</p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            Chat với chuyên gia EXO CORE
          </p>
        </div>
      </div>
    </aside>
  );
}

function SummaryLine({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={accent ? "font-black text-emerald-600" : "font-black"}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({ icon: Icon, children }) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}
