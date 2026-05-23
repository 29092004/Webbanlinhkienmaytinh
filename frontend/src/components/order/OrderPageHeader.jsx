import { ChevronRight, FileText, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderPageHeader({
  orderCode,
  orderedAt,
  onDownloadInvoice,
  onSupport,
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-[12px] font-medium text-slate-500">
          <Link to="/" className="transition-colors hover:text-blue-700">
            Đơn hàng của tôi
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="text-blue-700">Chi tiết {orderCode}</span>
        </nav>

        <h1 className="m-0 text-[30px] font-black leading-tight tracking-normal text-slate-950 sm:text-[36px]">
          Chi tiết đơn hàng{" "}
          <span className="text-blue-700">{orderCode}</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Ngày đặt hàng: {orderedAt}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onDownloadInvoice}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          <FileText className="size-4" />
          Tải hóa đơn PDF
        </button>
        <button
          type="button"
          onClick={onSupport}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white shadow-[0_10px_18px_rgba(0,82,204,0.22)] transition hover:bg-blue-800"
        >
          <ShieldAlert className="size-4" />
          Hỗ trợ kỹ thuật
        </button>
      </div>
    </div>
  );
}
