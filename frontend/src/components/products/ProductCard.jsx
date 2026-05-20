import { ShoppingCart, Star } from "lucide-react";

export function ProductCard({ product }) {
  // Generate stars array
  const stars = Array.from({ length: 5 }, (_, idx) => idx < Math.floor(product.rating));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col relative group hover:shadow-md transition-shadow">
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.tag && (
          <span className={`text-[9px] font-bold text-white uppercase px-2 py-0.5 rounded tracking-wide ${product.tagColor || "bg-blue-600"}`}>
            {product.tag}
          </span>
        )}
        {product.discount && (
          <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
            {product.discount}
          </span>
        )}
      </div>

      {/* Image container */}
      <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden p-2 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded group-hover:scale-102 transition-transform duration-300"
        />
      </div>

      {/* Review Stars */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex items-center gap-0.5 text-amber-400">
          {stars.map((filled, i) => (
            <Star
              key={i}
              className={`size-3 ${filled ? "fill-amber-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-gray-500 font-semibold">
          ({product.reviewsCount})
        </span>
      </div>

      {/* Product Title */}
      <h3 className="font-bold text-gray-900 text-sm mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
        {product.name}
      </h3>

      {/* Pricing */}
      <div className="flex flex-col gap-0.5 mb-4">
        <span className="text-blue-600 font-extrabold text-base">
          {product.price.toLocaleString("vi-VN")}đ
        </span>
        {product.originalPrice && (
          <span className="text-gray-400 text-xs line-through">
            {product.originalPrice.toLocaleString("vi-VN")}đ
          </span>
        )}
      </div>

      {/* Add to Cart button */}
      <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
        <ShoppingCart className="size-3.5" />
        Thêm vào giỏ
      </button>
    </div>
  );
}
