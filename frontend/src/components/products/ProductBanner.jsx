import { ChevronRight } from "lucide-react";

export function ProductBanner({ totalProducts }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-100 uppercase mb-4">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight className="size-3 text-blue-300" />
          <span className="text-blue-300">Products</span>
          <ChevronRight className="size-3 text-blue-300" />
          <span className="text-white">GPU</span>
        </nav>

        {/* Title & Description */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          Card Đồ Họa
        </h1>
        <p className="text-sm text-blue-100 font-medium">
          {totalProducts} sản phẩm được tuyển chọn cho hiệu suất tối đa
        </p>
      </div>
    </div>
  );
}
