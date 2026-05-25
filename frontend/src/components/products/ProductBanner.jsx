import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function ProductBanner({ totalProducts }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb
            isLightBg={false}
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: "Card đồ họa" },
            ]}
          />
        </div>

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
