import { Trash2, Minus, Plus } from "lucide-react";

export function CartItemRow({ item, selected, onToggleSelect, onQuantityChange, onRemove }) {
  const itemTotal = item.price * item.quantity;
  const itemOriginalTotal = item.originalPrice ? item.originalPrice * item.quantity : null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-100 flex items-center gap-4 relative group hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      {/* Circular Checkbox */}
      <button
        type="button"
        onClick={() => onToggleSelect(item.id)}
        className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          selected
            ? "bg-blue-600 border-blue-600 text-white"
            : "border-slate-200 hover:border-blue-500 bg-white"
        }`}
        aria-label={selected ? "Bỏ chọn sản phẩm" : "Chọn sản phẩm"}
      >
        {selected && (
          <svg className="size-2.5 fill-current stroke-[3px]" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <div className="size-20 bg-slate-50 rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>

      {/* Details Area */}
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0 pr-6">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">
            {item.name}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide truncate">
            {item.details}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mt-3 flex-wrap">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-xl border border-slate-150 bg-slate-50 p-0.5">
            <button
              type="button"
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="size-7 flex items-center justify-center text-slate-500 hover:text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-slate-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="size-7 flex items-center justify-center text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <Plus className="size-3" />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
            {itemOriginalTotal && (
              <span className="block text-[10px] text-slate-400 line-through font-bold leading-none mb-1">
                {itemOriginalTotal.toLocaleString("vi-VN")}đ
              </span>
            )}
            <span className="block text-red-600 font-black text-sm leading-none">
              {itemTotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
        aria-label="Xóa sản phẩm"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
