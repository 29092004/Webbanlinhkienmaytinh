import { useRef, useState } from "react";
import { ImageOff, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";
import { ProductHoverPopup } from "./ProductHoverPopup";

export function ProductCard({ product }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const productDetailPath = `/product/${product.id || 3}`;

  const updateCoords = (e) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { clientX, clientY } = e;

    const popupWidth = 700;
    const popupHeight = 440; // Conservative height estimate to prevent bottom clipping

    let left = 0;
    if (clientX > windowWidth / 2) {
      left = clientX - popupWidth - 24;
    } else {
      left = clientX + 24;
    }

    if (left < 12) {
      left = 12;
    } else if (left + popupWidth > windowWidth - 12) {
      left = windowWidth - popupWidth - 12;
    }

    let top = 0;
    if (clientY > windowHeight / 2) {
      // Near bottom: position popup above the cursor so it isn't cut off
      top = clientY - popupHeight - 15;
    } else {
      // Near top: position popup aligned/below the cursor
      top = clientY - 80;
    }

    // Viewport height safety boundaries
    if (top + popupHeight > windowHeight - 12) {
      top = windowHeight - popupHeight - 12;
    }
    if (top < 12) {
      top = 12;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = (e) => {
    updateCoords(e);
  };

  const handleMouseMove = (e) => {
    updateCoords(e);
  };

  const handleMouseLeave = () => {
    setCoords(null);
  };

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
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative group hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300"
    >
      <ProductHoverPopup product={product} coords={coords} />

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
            className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <ImageOff className="mb-2 size-10" />
            <span className="text-xs font-semibold">Chua co hinh anh</span>
          </div>
        )}
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
