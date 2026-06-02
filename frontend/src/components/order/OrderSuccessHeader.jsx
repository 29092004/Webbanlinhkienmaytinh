import { Check, X } from "lucide-react";

export default function OrderSuccessHeader({ paymentStatus = "default" }) {
  const isSuccess = paymentStatus !== "failed" && paymentStatus !== "invalid";

  return (
    <div className="w-full max-w-5xl rounded-[28px] border border-slate-200 bg-white px-6 py-8 text-center shadow-sm md:px-10">
      {/* Animated Check Circle */}
      <div className="relative flex items-center justify-center">
        {/* Main Circle */}
        <div className={`relative flex size-20 items-center justify-center rounded-full border-4 bg-white shadow-lg ${isSuccess ? "border-slate-900" : "border-rose-500"}`}>
          {isSuccess ? (
            <Check className="size-10 text-slate-900 stroke-[3.5]" />
          ) : (
            <X className="size-10 text-rose-500 stroke-[3.5]" />
          )}
        </div>
      </div>

      {/* Success Title */}
      <h2 style={{ textAlign: "center" }} className="mt-4 text-center text-2xl font-bold tracking-[-0.01em] text-gray-900 md:text-3xl">
        {isSuccess ? "Đặt hàng thành công" : "Thanh toán chưa thành công"}
      </h2>

      {/* Sub-description */}
      <p style={{ textAlign: "center" }} className="mx-auto mt-3 max-w-2xl text-center text-sm font-semibold leading-7 text-slate-500 md:text-[1.05rem]">
        {isSuccess
          ? "Cảm ơn bạn đã tin tưởng EXO CORE. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý kỹ thuật tỉ mỉ."
          : "Giao dịch VNPay chưa hoàn tất. Bạn có thể kiểm tra lại đơn hàng hoặc quay về checkout để thực hiện thanh toán lại."}
      </p>
    </div>
  );
}
