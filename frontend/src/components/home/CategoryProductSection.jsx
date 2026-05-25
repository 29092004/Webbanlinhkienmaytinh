import { ImageOff, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export function CategoryProductSection({ title, subtitle, products = [] }) {
  return (
    <section className="bg-[#f8f9fa] border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="mt-2 text-xs font-medium text-gray-500">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden p-2 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full rounded group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 text-gray-400">
                      <ImageOff className="mb-2 size-10" />
                      <span className="text-xs font-medium">Chưa có hình ảnh</span>
                    </div>
                  )}
                </Link>
                <Link to={`/product/${product.id}`}>
                  <h3 className="min-h-[40px] text-sm font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                </Link>
                <p className="mb-4 mt-1 min-h-[32px] text-[11px] text-gray-500">{product.desc}</p>
                <div className="mt-auto">
                  <div className="mb-3 text-base font-bold text-blue-600">{product.price}₫</div>
                  <Link to={`/product/${product.id}`} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Xem sản phẩm
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
              Danh mục này hiện chưa có sản phẩm.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
