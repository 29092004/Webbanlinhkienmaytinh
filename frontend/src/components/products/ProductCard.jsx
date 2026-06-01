import { ImageOff, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";

export function ProductCard({ product }) {
  const productDetailPath = `/product/${product.id || 3}`;

  const handleAddToCart = async () => {
    try {
      await addProductToCart({ productId: product.id, quantity: 1 });
      showToast({
        message: `Đã thêm ${product.name} vào giỏ hàng.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add product to cart", error);
      showToast({
        message: "Không thêm được sản phẩm vào giỏ hàng.",
        type: "error",
      });
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative group hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300"
    >
      {product.isOnSale ? (
        <span className="absolute left-3 top-3 z-10 rounded-lg bg-[#e21a36] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
          Sale
        </span>
      ) : null}

      {/* Image container */}
      <Link to={productDetailPath} className="aspect-square bg-slate-50 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <ImageOff className="mb-2 size-10" />
            <span className="text-xs font-semibold">Chua co hinh anh</span>
          </div>
        )}
      </Link>

      {/* Product Title */}
      <Link to={productDetailPath} className="flex-1">
        <h3 className="font-semibold text-slate-900 text-[14px] leading-snug mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
      </Link>

      {/* Pricing */}
      <div className="flex flex-col gap-0.5 mb-4 pl-0.5">
        <span className="text-red-600 font-extrabold text-[17px]">
          {typeof product.price === "number" 
            ? `${product.price.toLocaleString("vi-VN")}đ` 
            : String(product.price).endsWith("đ") ? product.price : `${product.price}đ`}
        </span>
        {product.originalPrice ? (
          <span className="text-slate-400 text-xs line-through font-semibold">
            {typeof product.originalPrice === "number" 
              ? `${product.originalPrice.toLocaleString("vi-VN")}đ` 
              : String(product.originalPrice).endsWith("đ") ? product.originalPrice : `${product.originalPrice}đ`}
          </span>
        ) : (
          <span className="text-transparent text-xs select-none">0đ</span>
        )}
      </div>

      {/* Add to Cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full bg-[#e21a36] hover:bg-red-700 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingCart className="size-4 shrink-0" />
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
