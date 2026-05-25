import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function ProductCard({ product }) {
  const productDetailPath = `/product/${product.id || 3}`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative group hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
      {/* Badges container */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        {product.tag && (
          <span className={`text-[9px] font-extrabold text-white px-2 py-0.5 rounded tracking-wide uppercase ${product.tagColor || "bg-blue-600"}`}>
            {product.tag}
          </span>
        )}
      </div>

      {/* Image container */}
      <Link to={productDetailPath} className="aspect-square bg-slate-50 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Review Stars */}
      <div className="flex items-center gap-1 mb-2 pl-0.5">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        <span className="text-[12px] font-bold text-slate-800">
          {product.rating}
        </span>
        <span className="text-[12px] text-slate-400 font-semibold">
          ({product.reviewsCount})
        </span>
      </div>

      {/* Product Title */}
      <Link to={productDetailPath} className="flex-1">
        <h3 className="font-semibold text-slate-900 text-[14px] leading-snug mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
      </Link>

      {/* Pricing */}
      <div className="flex flex-col gap-0.5 mb-4 pl-0.5">
        <span className="text-blue-600 font-extrabold text-[17px]">
          {product.price.toLocaleString("vi-VN")}đ
        </span>
        {product.originalPrice ? (
          <span className="text-slate-400 text-xs line-through font-semibold">
            {product.originalPrice.toLocaleString("vi-VN")}đ
          </span>
        ) : (
          <span className="text-transparent text-xs select-none">0đ</span>
        )}
      </div>

      {/* Add to Cart button */}
      <button className="w-full bg-[#e21a36] hover:bg-red-700 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
        <ShoppingCart className="size-4 shrink-0" />
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
