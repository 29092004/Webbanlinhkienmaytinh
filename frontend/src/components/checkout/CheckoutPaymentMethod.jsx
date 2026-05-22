import { CreditCard, Check } from "lucide-react";

export default function CheckoutPaymentMethod({
  selectedMethod,
  onMethodChange,
  itemsSubtotal,
  shippingCost,
  pointsDiscount,
  voucherDiscount,
  totalPayment,
  onOrderSubmit,
  isSubmitting,
}) {
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
    },
    {
      id: "online",
      name: "VNPay / MoMo",
    },
    {
      id: "card",
      name: "Thẻ Tín dụng / Ghi nợ",
    },
    {
      id: "bank",
      name: "Chuyển khoản Ngân hàng",
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-wider">
        <CreditCard className="size-5" />
        <span>Phương thức thanh toán</span>
      </div>

      {/* Methods Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              className={`relative py-3.5 px-3 rounded-lg border text-center text-xs font-bold transition flex items-center justify-center min-h-[50px] ${
                isSelected
                  ? "border-blue-600 text-blue-600 bg-blue-50/10 shadow-sm"
                  : "border-slate-200 text-gray-600 hover:bg-slate-50"
              }`}
            >
              {method.name}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white rounded-full size-4.5 flex items-center justify-center border border-white">
                  <Check className="size-3 text-white font-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Pricing Summary Box */}
      <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 text-xs md:text-sm font-semibold text-gray-600 space-y-3.5">
        <div className="flex justify-between items-center">
          <span>Tổng tiền hàng:</span>
          <span className="text-gray-900 font-bold">{itemsSubtotal.toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí vận chuyển:</span>
          <span className="text-gray-950 font-bold">
            {shippingCost === 0 ? "0đ" : `${shippingCost.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        {pointsDiscount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span>Giảm giá từ điểm:</span>
            <span>-{pointsDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span>Voucher giảm giá:</span>
            <span>-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-3.5 flex justify-between items-center">
          <span className="text-sm font-extrabold text-gray-800">Tổng thanh toán:</span>
          <span className="text-xl md:text-2xl font-black text-blue-600 tracking-tight">
            {totalPayment.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Footer Submission Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <p className="text-[11px] font-semibold text-gray-400 leading-relaxed max-w-lg">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </a>{" "}
          của EXO CORE.
        </p>

        <button
          type="button"
          onClick={onOrderSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold py-3.5 px-10 rounded-lg text-xs md:text-sm tracking-wider uppercase transition-colors shrink-0 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}
