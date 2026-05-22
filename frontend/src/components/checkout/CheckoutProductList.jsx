import { useState } from "react";

export default function CheckoutProductList({
  cartItems,
  note,
  onNoteChange,
  shippingMethod,
  onShippingMethodChange,
}) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shippingOptions = [
    {
      id: "express",
      name: "Hỏa tốc",
      desc: "Nhận hàng trong vòng 2-4 giờ",
      price: 0,
    },
    {
      id: "standard",
      name: "Nhanh",
      desc: "Nhận hàng trong vòng 2-3 ngày",
      price: 0,
    },
  ];

  const currentOption = shippingOptions.find((opt) => opt.id === shippingMethod) || shippingOptions[0];

  const [showShippingDropdown, setShowShippingDropdown] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
      {/* Product List Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-6">Sản phẩm</div>
        <div className="col-span-2 text-center">Đơn giá</div>
        <div className="col-span-2 text-center">Số lượng</div>
        <div className="col-span-2 text-right">Thành tiền</div>
      </div>

      {/* Product Rows */}
      <div className="divide-y divide-slate-100">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center text-xs md:text-sm text-gray-800"
          >
            {/* Info */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="size-16 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-1 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-900 line-clamp-2">{item.name}</h4>
                <p className="text-[11px] text-gray-400 font-semibold italic">{item.details}</p>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-4 md:col-span-2 text-left md:text-center font-semibold text-gray-600 md:text-gray-800 flex md:block items-center gap-2">
              <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase">Đơn giá:</span>
              <span>{item.price.toLocaleString("vi-VN")}đ</span>
            </div>

            {/* Qty */}
            <div className="col-span-4 md:col-span-2 text-left md:text-center font-bold text-gray-600 md:text-gray-900 flex md:block items-center gap-2">
              <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase">Số lượng:</span>
              <span>{String(item.quantity).padStart(2, "0")}</span>
            </div>

            {/* Subtotal */}
            <div className="col-span-4 md:col-span-2 text-right font-extrabold text-blue-600 md:text-gray-900 flex md:block justify-end md:justify-start items-center gap-2">
              <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase mr-auto">Thành tiền:</span>
              <span>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        ))}
      </div>

      {/* Note and Shipping row */}
      <div className="bg-[#fcfdff] border-t border-b border-dashed border-slate-200 p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Note */}
        <div className="w-full lg:max-w-md flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
            Lời nhắn:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Lưu ý cho người bán..."
            className="flex-1 bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Shipping */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 text-xs">
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-500">Phương thức vận chuyển:</span>
              <span className="font-extrabold text-gray-900">{currentOption.name}</span>
              <span className="text-gray-400 font-medium">({currentOption.desc})</span>
              <button
                type="button"
                onClick={() => setShowShippingDropdown(!showShippingDropdown)}
                className="text-blue-600 font-bold hover:text-blue-700 transition uppercase tracking-wide ml-2"
              >
                Thay đổi
              </button>
            </div>

            {showShippingDropdown && (
              <div className="absolute right-0 bottom-8 z-20 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-3 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide px-1">
                  Chọn phương thức vận chuyển
                </p>
                <div className="space-y-1">
                  {shippingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onShippingMethodChange(opt.id);
                        setShowShippingDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border transition ${
                        shippingMethod === opt.id
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-gray-900">{opt.name}</span>
                        <span className="font-extrabold text-blue-600">
                          {opt.price === 0 ? "0đ" : `${opt.price.toLocaleString("vi-VN")}đ`}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="font-extrabold text-gray-900 self-end sm:self-auto">
            {currentOption.price === 0 ? "0đ" : `${currentOption.price.toLocaleString("vi-VN")}đ`}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-slate-50/50 flex justify-end text-xs md:text-sm font-semibold text-gray-600">
        <div className="flex items-center gap-1">
          <span>Tổng số tiền ({totalItems} sản phẩm):</span>
          <span className="text-base md:text-lg font-black text-blue-600">
            {itemsSubtotal.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  );
}
