import { FileText, ShieldAlert } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function OrderPageHeader({
  orderCode,
  orderedAt,
  onDownloadInvoice,
  onSupport,
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3">
          <Breadcrumb
            items={[
              { label: "Đơn hàng của tôi", href: "/profile/orders" },
              { label: `Chi tiết ${orderCode}` },
            ]}
          />
        </div>

        <h1 className="m-0 text-[28px] font-bold leading-tight tracking-[-0.01em] text-slate-950 sm:text-[32px]">
          Chi tiết đơn hàng{" "}
          <span className="font-bold text-blue-700">{orderCode}</span>
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
