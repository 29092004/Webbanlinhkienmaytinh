import { Check, X } from "lucide-react";

export default function OrderSuccessHeader({ paymentStatus = "default" }) {
  const isSuccess = paymentStatus !== "failed" && paymentStatus !== "invalid";

  return (
    <div className="flex flex-col items-center text-center space-y-4 py-8 animate-fade-in">
      {/* Animated Check Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ripple */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isSuccess ? "bg-blue-100/40" : "bg-rose-100/70"}`} />
        
        {/* Main Circle */}
        <div className={`relative flex size-20 items-center justify-center rounded-full border-4 bg-white shadow-lg transition-transform duration-500 hover:scale-105 ${isSuccess ? "border-blue-600" : "border-rose-500"}`}>
          {isSuccess ? (
            <Check className="size-10 text-blue-600 stroke-[3.5]" />
          ) : (
            <X className="size-10 text-rose-500 stroke-[3.5]" />
          )}
        </div>
      </div>

      {/* Success Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-[-0.01em] mt-4">
        {isSuccess ? "Đặt hàng thành công" : "Thanh toán chưa thành công"}
      </h2>

      {/* Sub-description */}
      <p className="text-xs md:text-sm text-gray-500 font-semibold max-w-md leading-relaxed">
        {isSuccess
          ? "Cảm ơn bạn đã tin tưởng EXO CORE. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý kỹ thuật tỉ mỉ."
          : "Giao dịch VNPay chưa hoàn tất. Bạn có thể kiểm tra lại đơn hàng hoặc quay về checkout để thực hiện thanh toán lại."}
      </p>
    </div>
  );
}
