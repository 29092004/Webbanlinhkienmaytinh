import { Box } from "lucide-react";

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

export default function OrderProductsList({ items = [] }) {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-[#f1f3f5] px-6 py-4">
        <Box className="size-4 text-slate-900" />
        <h3 className="m-0 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
          Danh sách sản phẩm ({items.length})
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[86px_minmax(0,1fr)] gap-5 px-6 py-7 sm:grid-cols-[96px_minmax(0,1fr)_180px]"
          >
            <div className="flex size-[86px] items-center justify-center overflow-hidden rounded bg-slate-100 sm:size-24">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h4 className="m-0 text-xl font-black leading-snug text-slate-950 sm:text-2xl">
                {item.name}
              </h4>
              <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.05em] text-slate-500">
                SKU: {item.sku}
              </p>
              {item.badge && (
                <span className="mt-2 inline-flex rounded-sm bg-blue-50 px-2 py-1 text-[12px] font-semibold leading-none text-blue-700">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="col-span-2 text-left sm:col-span-1 sm:text-right">
              <p className="text-2xl font-medium leading-tight text-blue-700">
                {formatCurrency(item.price)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                x{item.quantity}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
