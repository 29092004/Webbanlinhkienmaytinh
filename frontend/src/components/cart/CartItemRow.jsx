import { Trash2, Minus, Plus } from "lucide-react";

export function CartItemRow({ item, onQuantityChange, onRemove }) {
  const itemTotal = item.price * item.quantity;
  const itemOriginalTotal = item.originalPrice ? item.originalPrice * item.quantity : null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4 relative group hover:shadow-md transition-shadow">
      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <Trash2 className="size-4.5" />
      </button>

      {/* Product Image */}
      <div className="size-24 bg-slate-50 rounded-lg overflow-hidden p-2 flex items-center justify-center shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full rounded"
        />
      </div>

      {/* Details Area */}
      <div className="flex-1 flex flex-col justify-between py-1 pr-6">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm mb-1 line-clamp-1">
            {item.name}
          </h3>
          <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wide">
            {item.details}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mt-auto">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="size-7 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-40 transition-colors"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-slate-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="size-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Individual Pricing */}
          <div className="text-right">
            {itemOriginalTotal && (
              <span className="block text-[10px] text-gray-400 line-through font-bold leading-none mb-1">
                {itemOriginalTotal.toLocaleString("vi-VN")}đ
              </span>
            )}
            <span className="block text-blue-600 font-extrabold text-sm leading-none">
              {itemTotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
