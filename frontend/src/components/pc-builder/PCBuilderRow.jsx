import { Plus, Trash2, RefreshCw, ImageOff } from "lucide-react";
import { resolveAssetUrl, calculateDiscountedPrice } from "@/components/admin/product/productUtils";

export function PCBuilderRow({
  index,
  slot,
  selectedProduct,
  quantity = 1,
  onSelectClick,
  onRemoveClick,
  onQtyChange,
}) {
  const mainImage = selectedProduct?.images?.[0]?.url
    ? resolveAssetUrl(selectedProduct.images[0].url)
    : null;

  const pricing = calculateDiscountedPrice({
    retailPrice: selectedProduct?.retail_price,
    saleType: selectedProduct?.sale_type,
    saleValue: selectedProduct?.sale_value,
    isOnSale: Boolean(selectedProduct?.sale_id),
  });

  const unitPrice = pricing.finalPrice;
  const originalPrice = pricing.basePrice;
  const hasDiscount = unitPrice < originalPrice;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_auto] items-center gap-4 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/30 px-3 rounded-2xl transition">
      {/* Category Info */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-[-0.01em]">
            {slot.name}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {slot.category_name}
          </span>
        </div>
      </div>

      {/* Selected Product Details or Selection Call to Action */}
      {selectedProduct ? (
        <div className="grid grid-cols-1 sm:grid-cols-[64px_1fr_120px_100px] items-center gap-4">
          {/* Thumbnail */}
          <div className="size-14 bg-white border border-slate-100 rounded-xl overflow-hidden p-1 flex items-center justify-center shrink-0">
            {mainImage ? (
              <img
                src={mainImage}
                alt={selectedProduct.name}
                className="object-contain w-full h-full"
              />
            ) : (
              <ImageOff className="size-6 text-slate-300" />
            )}
          </div>

          {/* Name & Brand */}
          <div className="min-w-0">
            <h4 className="text-[15px] font-semibold text-slate-900 truncate tracking-[-0.01em]">
              {selectedProduct.name}
            </h4>
            <span className="text-sm font-medium text-slate-400">
              {selectedProduct.brand_name || "Linh kiện"}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQtyChange(slot.id, quantity - 1)}
              disabled={quantity <= 1}
              className="size-7 rounded-lg border border-slate-200 flex items-center justify-center text-sm font-semibold hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => onQtyChange(slot.id, quantity + 1)}
              className="size-7 rounded-lg border border-slate-200 flex items-center justify-center text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Pricing Info */}
          <div className="text-right flex flex-col items-end">
            <div className="text-[15px] font-semibold text-slate-950">
              {Number(unitPrice * quantity).toLocaleString("vi-VN")} đ
            </div>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {Number(originalPrice * quantity).toLocaleString("vi-VN")} đ
              </span>
            )}
            {quantity > 1 && (
              <span className="text-xs text-slate-400 font-medium">
                {Number(unitPrice).toLocaleString("vi-VN")} đ / chiếc
              </span>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onSelectClick}
          className="border border-dashed border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-[15px] font-semibold text-slate-900 transition cursor-pointer min-h-[58px] w-full text-left sm:w-auto sm:min-w-[280px] lg:justify-start tracking-[-0.01em]"
        >
          <Plus className="size-4" />
          Chọn {slot.name}
        </button>
      )}

      {/* Row Actions */}
      {selectedProduct && (
        <div className="flex items-center gap-2 lg:ml-4 justify-end">
          <button
            onClick={onSelectClick}
            className="p-2 border border-slate-200 hover:border-slate-400 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition cursor-pointer"
            title="Đổi linh kiện"
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            onClick={() => onRemoveClick(slot.id)}
            className="p-2 border border-slate-200 hover:border-red-600 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer"
            title="Gỡ linh kiện"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

