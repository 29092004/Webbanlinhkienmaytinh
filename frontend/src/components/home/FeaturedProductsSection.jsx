import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedProductsSection({ products = [] }) {
  return (
    <section className="bg-[#f8f9fa] pb-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Sản Phẩm Nổi Bật</h2>
          <p className="text-xs text-gray-500 font-medium">Những linh kiện được các chuyên gia TECHSPEC khuyên dùng</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow">
                <Link to={`/product/${p.id}`} className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden p-2 flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="object-cover w-full h-full rounded group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[40px]">{p.name}</h3>
                </Link>
                <p className="text-[11px] text-gray-500 mb-4 min-h-[32px]">{p.desc}</p>
                <div className="mt-auto">
                  <div className="text-blue-600 font-bold text-base mb-3">{p.price}₫</div>
                  <Link to={`/product/${p.id}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Xem sản phẩm
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
              Chưa có sản phẩm thường để hiển thị.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
