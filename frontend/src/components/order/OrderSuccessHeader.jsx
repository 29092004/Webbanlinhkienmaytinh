import { Check } from "lucide-react";

export default function OrderSuccessHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-8 animate-fade-in">
      {/* Animated Check Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ripple */}
        <div className="absolute inset-0 rounded-full bg-blue-100/40 animate-ping opacity-75" />
        
        {/* Main Circle */}
        <div className="relative size-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 hover:scale-105">
          <Check className="size-10 text-blue-600 stroke-[3.5]" />
        </div>
      </div>

      {/* Success Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-[-0.01em] mt-4">
        Đặt hàng thành công
      </h2>

      {/* Sub-description */}
      <p className="text-xs md:text-sm text-gray-500 font-semibold max-w-md leading-relaxed">
        Cảm ơn bạn đã tin tưởng EXO CORE. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý kỹ thuật tỉ mỉ.
      </p>
    </div>
  );
}
