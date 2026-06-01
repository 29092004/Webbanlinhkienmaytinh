import { ImageOff, Trash2, Plus, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";

export function CompareHeader({
  products = [],
  onRemove,
  onAddClick,
  categoryName = "",
}) {
  const handleAddToCart = async (product) => {
    try {
      await addProductToCart({ productId: product.id, quantity: 1 });
      showToast({
        message: `Đã thêm ${product.name} vào giỏ hàng.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add product to cart from comparison", error);
      showToast({
        message: "Không thêm được sản phẩm vào giỏ hàng.",
        type: "error",
      });
    }
  };

  // Ensure we always have 3 columns for products (even if some are empty)
  const columns = Array.from({ length: 3 }, (_, index) => products[index] || null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      {/* Column 0: Information / Sidebar */}
      <div className="flex flex-col justify-between p-2 border-b md:border-b-0 md:border-r border-slate-100 pr-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-[-0.02em]">
            So sánh
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1">
            {categoryName ? `${categoryName} cùng loại` : "Sản phẩm cùng loại"}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-[11px] font-semibold text-slate-400 leading-relaxed">
          So sánh các thông số kỹ thuật chi tiết của tối đa 3 sản phẩm để đưa ra lựa chọn tốt nhất.
        </div>
      </div>

      {/* Columns 1, 2, 3: Products */}
      {columns.map((product, index) => {
        if (product) {
          const detailPath = `/product/${product.id}`;
          return (
            <div
              key={product.id}
              className="relative border border-slate-100 rounded-2xl p-4 flex flex-col justify-between bg-slate-50/20 group hover:shadow-md transition duration-300"
            >
              {/* Remove button */}
              <button
                onClick={() => onRemove(product.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer"
                title="Xóa khỏi so sánh"
              >
                <Trash2 className="size-4" />
              </button>

              <div className="space-y-3">
                {/* Image */}
                <Link
                  to={detailPath}
                  className="aspect-square bg-white rounded-xl overflow-hidden p-2 flex items-center justify-center border border-slate-50"
                >
                  {product.images?.[0] || product.image ? (
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="object-contain w-full h-full group-hover:scale-102 transition"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                      <ImageOff className="size-8 mb-1" />
                      <span className="text-[10px] font-semibold">Không có ảnh</span>
                    </div>
                  )}
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 pl-0.5">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">
                    {product.rating}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    ({product.reviewsCount})
                  </span>
                </div>

                {/* Name */}
                <Link to={detailPath} className="block">
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900 hover:text-slate-700 transition line-clamp-2 min-h-[40px] leading-snug">
                    {product.name}
                  </h3>
                </Link>

                {/* Pricing */}
                <div className="flex flex-col gap-0.5 pl-0.5">
                  <span className="text-red-600 font-extrabold text-[15px]">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  {product.originalPrice ? (
                    <span className="text-slate-400 text-[11px] line-through font-semibold">
                      {product.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  ) : (
                    <span className="text-transparent text-[11px] select-none">0đ</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#e21a36] hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="size-3.5 shrink-0" />
                  Mua ngay
                </button>
              </div>
            </div>
          );
        }

        // Empty slot
        return (
          <div
            key={`empty-${index}`}
            onClick={onAddClick}
            className="border-2 border-dashed border-slate-200 hover:border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition duration-300 cursor-pointer group min-h-[220px]"
          >
            <div className="size-11 rounded-full bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-white transition mb-3">
              <Plus className="size-5" />
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition">
              Thêm sản phẩm
            </span>
            <span className="text-[10px] text-slate-400 font-semibold mt-1">
              Chọn sản phẩm cùng loại
            </span>
          </div>
        );
      })}
    </div>
  );
}
