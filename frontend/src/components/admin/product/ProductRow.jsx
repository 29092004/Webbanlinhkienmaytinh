import { Eye, Package, Pencil, Trash2 } from "lucide-react";

import { calculateDiscountedPrice, formatSalePercentage, resolveAssetUrl } from "./productUtils";

export function ProductRow({
  product,
  brands,
  categories,
  onView,
  onEdit,
  onDelete,
  canManage = true,
}) {
  const brand = brands.find((item) => item.brand_id === product.brand_id);
  const category = categories.find((item) => item.id === product.category_id);
  const image = product.images?.[0]?.url;
  const salePricing = calculateDiscountedPrice({
    retailPrice: product.retail_price,
    saleType: product.sale_type,
    saleValue: product.sale_value,
    isOnSale: Boolean(product.sale_id),
  });

  return (
    <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(120px,1fr)_minmax(120px,0.9fr)_minmax(140px,0.9fr)_90px_132px] items-center gap-4 border-t border-slate-100 px-4 py-4 text-sm text-slate-700 first:border-t-0">
      <div className="flex min-w-0 items-center gap-3">
        {image ? (
          <img src={resolveAssetUrl(image)} alt="" className="size-12 rounded-xl bg-slate-100 object-cover" />
        ) : (
          <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#eef3f9] text-slate-500">
            <Package className="size-4" />
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-[0.95rem] font-semibold text-slate-950" title={product.name}>
            {product.name}
          </div>
          <div className="mt-1 text-xs text-slate-400">ID #{product.id}</div>
        </div>
      </div>

      <div className="text-[0.82rem]">
        <div className="truncate font-semibold text-slate-900">{brand?.brand_name || "N/A"}</div>
        <div className="truncate text-slate-500">{category?.name || "N/A"}</div>
      </div>

      <div>
        {product.sale_id ? (
          <div className="space-y-2">
            <span className="inline-flex whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-[0.72rem] font-bold text-amber-700">
              Đang sale
            </span>
            <div className="text-[0.78rem] font-semibold text-amber-700">
              {product.sale_type === "fixed"
                ? `-${Number(product.sale_value || 0).toLocaleString("vi-VN")}đ`
                : `-${formatSalePercentage(product.sale_value)}`}
            </div>
          </div>
        ) : (
          <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[0.72rem] font-bold text-slate-600">
            Không sale
          </span>
        )}
      </div>

      <div>
        {product.sale_id ? (
          <div className="space-y-1">
            <div className="whitespace-nowrap font-bold text-rose-600">
              {salePricing.finalPrice.toLocaleString("vi-VN")} đ
            </div>
            <div className="whitespace-nowrap text-[0.8rem] text-slate-400 line-through">
              {salePricing.basePrice.toLocaleString("vi-VN")} đ
            </div>
          </div>
        ) : (
          <div className="whitespace-nowrap font-semibold text-slate-900">
            {Number(product.retail_price).toLocaleString("vi-VN")} đ
          </div>
        )}
      </div>

      <div>
        <span className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
          product.quantity > 0 ? "bg-[#dffbe8] text-[#13a34b]" : "bg-rose-100 text-rose-700"
        }`}>
          {product.quantity}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(product)}
          title="Xem"
          className="inline-flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-600"
        >
          <Eye className="size-4" />
        </button>
        {canManage ? (
          <>
            <button
              type="button"
              onClick={() => onEdit(product)}
              title="Sửa"
              className="inline-flex size-10 items-center justify-center rounded-xl bg-[#ffc107] text-white transition hover:bg-[#e9b000]"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              title="Xóa"
              className="inline-flex size-10 items-center justify-center rounded-xl bg-[#ff0a0a] text-white transition hover:bg-[#e00000]"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
