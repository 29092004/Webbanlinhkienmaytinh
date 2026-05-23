import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

const tagToneClassName = {
  blue: "bg-blue-950/70 text-blue-500",
  orange: "bg-orange-950/60 text-orange-500",
};

export default function SearchProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-square overflow-hidden bg-slate-950">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {product.tag ? (
            <span
              className={`absolute left-6 top-6 rounded-full px-4 py-1 text-sm font-bold uppercase ${
                tagToneClassName[product.tagTone] || tagToneClassName.blue
              }`}
            >
              {product.tag}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-8">
        <p className="text-lg font-medium uppercase tracking-[0.12em] text-blue-700">
          {product.brand}
        </p>
        <h2 className="m-0 mt-4 text-[30px] font-black leading-tight tracking-normal text-slate-950">
          {product.name}
        </h2>

        <div className="mt-8 space-y-3">
          {product.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm font-medium"
            >
              <span className="text-slate-700">{spec.label}</span>
              <span className="font-black text-slate-950">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xl font-medium text-blue-700">
            {formatCurrency(product.price)}
          </p>
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingCart className="size-6" />
          </button>
        </div>
      </div>
    </article>
  );
}
