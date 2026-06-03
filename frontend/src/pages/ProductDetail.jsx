import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecsTable } from "@/components/products/ProductSpecsTable";
import { ProductReviewsTab } from "@/components/products/ProductReviewsTab";
import { ProductCard } from "@/components/products/ProductCard";
import { Star, ShoppingBag, RefreshCw } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import {
  mapProductDetailForView,
  mapRelatedProduct,
} from "@/lib/productMappers";
import { api } from "@/lib/api";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";
import { CompareSelectionModal } from "@/components/products/CompareSelectionModal";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("specs");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setError("");
        setActiveTab("specs");

        const [productResponse, productsResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/products"),
        ]);

        const fetchedProduct = productResponse.data?.data ?? null;
        const allProducts = Array.isArray(productsResponse.data?.data) ? productsResponse.data.data : [];

        if (!isMounted) {
          return;
        }

        setProduct(fetchedProduct);
        setRelatedProducts(
          allProducts
            .filter((item) => item.id !== fetchedProduct?.id)
            .sort((left, right) => {
              const leftScore = left.category_id === fetchedProduct?.category_id ? 0 : 1;
              const rightScore = right.category_id === fetchedProduct?.category_id ? 0 : 1;

              if (leftScore !== rightScore) {
                return leftScore - rightScore;
              }

              return Number(right.id || 0) - Number(left.id || 0);
            })
            .slice(0, 4)
            .map(mapRelatedProduct)
        );
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch product detail", nextError);
        setError("Khong the tai chi tiet san pham.");
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const displayProduct = useMemo(() => mapProductDetailForView(product), [product]);
  const isOutOfStock = Number(product?.quantity || 0) <= 0;

  const savingAmount = (displayProduct?.originalPrice || 0) - (displayProduct?.price || 0);
  const savingPct = displayProduct?.originalPrice
    ? Math.round((savingAmount / displayProduct.originalPrice) * 100)
    : 0;

  const tabs = [
    { id: "specs", label: "THÔNG SỐ KỸ THUẬT" },
    { id: "desc", label: "MÔ TẢ CHI TIẾT" },
    { id: "reviews", label: `ĐÁNH GIÁ (${displayProduct?.reviewsCount || 0})` }
  ];

  const handleAddCurrentProductToCart = async ({ redirectToCheckout = false } = {}) => {
    if (!displayProduct?.id) {
      return;
    }

    if (isOutOfStock) {
      showToast({
        message: `${displayProduct.name} hiện đã hết hàng.`,
        type: "error",
      });
      return;
    }

    try {
      await addProductToCart({ productId: displayProduct.id, quantity: 1 });

      if (redirectToCheckout) {
        navigate("/checkout");
        return;
      }

      showToast({
        message: `Đã thêm ${displayProduct.name} vào giỏ hàng.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add current product to cart", error);
      showToast({
        message: error?.message || "Không thêm được sản phẩm vào giỏ hàng.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Linh kiện PC", href: "/products" },
            { label: displayProduct?.categoryName || "Sản phẩm", href: "/products" },
            { label: displayProduct?.name || "Chi tiết sản phẩm" }
          ]}
        />

        {isLoading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-sm font-semibold text-slate-400 shadow-sm">
            Dang tai chi tiet san pham...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-3xl border border-rose-100 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-rose-500">{error}</p>
          </div>
        ) : null}

        {!isLoading && displayProduct ? (
          <>
        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 w-full">
            <ProductGallery images={displayProduct.images} />
          </div>

          {/* Right Column: Order Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400">
                  SKU: {displayProduct.sku}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                    isOutOfStock ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isOutOfStock ? "Hết hàng" : "Còn hàng"}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {displayProduct.name}
              </h1>

              {/* Stars & review counter */}
              <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-500">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-amber-500 font-bold">{displayProduct.rating}</span>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-slate-900 hover:underline transition font-bold"
                >
                  {displayProduct.reviewsCount} Đánh giá
                </button>
                <span className="text-slate-300">|</span>
                <span>{isOutOfStock ? "Hết hàng" : displayProduct.soldText}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-red-50/10 border border-red-100 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-baseline gap-3 flex-wrap relative z-10">
                <span className="text-3xl font-black text-red-600">
                  {displayProduct.price.toLocaleString("vi-VN")}đ
                </span>
                {displayProduct.originalPrice && (
                  <span className="text-slate-400 line-through text-sm font-semibold">
                    {displayProduct.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              {displayProduct.originalPrice ? (
                <p className="text-xs font-bold text-red-500 relative z-10">
                  <span className="bg-red-50 text-red-500 border border-red-200 rounded px-1.5 py-0.5 text-[9px] mr-2">-{savingPct}%</span>
                  Tiết kiệm {savingAmount.toLocaleString("vi-VN")}đ
                </p>
              ) : (
                <p className="text-xs font-bold text-slate-500 relative z-10">
                  Giá đang được áp dụng trực tiếp cho sản phẩm này.
                </p>
              )}
            </div>



            {/* Actions Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleAddCurrentProductToCart({ redirectToCheckout: true })}
                  disabled={isOutOfStock}
                  className={`font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors uppercase ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "cursor-pointer bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
                </button>
                <button
                  onClick={() => handleAddCurrentProductToCart()}
                  disabled={isOutOfStock}
                  className={`font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors uppercase ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "cursor-pointer bg-[#e21a36] text-white hover:bg-red-700"
                  }`}
                >
                  <ShoppingBag className="size-4" />
                  {isOutOfStock ? "HẾT HÀNG" : "THÊM GIỎ HÀNG"}
                </button>
              </div>
              <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl text-[10px] flex items-center justify-center transition-colors uppercase">
                TRẢ GÓP 0% QUA THẺ TÍN DỤNG (XÉT DUYỆT TỨC THÌ)
              </button>
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-900 text-slate-900 font-bold py-3.5 px-4 rounded-2xl text-[10px] flex items-center justify-center gap-1.5 transition-colors uppercase cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  So sánh sản phẩm này
              </button>
            </div>
          </div>
        </div>

        {/* Tab Sections */}
        <div className="space-y-6 pt-2">
          {/* Tab Header Row */}
          <div className="border-b border-slate-200 flex overflow-x-auto no-scrollbar gap-6 md:gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs md:text-sm font-bold tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div>
            {activeTab === "specs" && (
              <ProductSpecsTable specs={displayProduct.specs} />
            )}

            {activeTab === "desc" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-[14px] text-slate-600 font-medium leading-relaxed">
                <h3 className="font-bold text-slate-900 text-base">Mô tả chi tiết sản phẩm</h3>
                {displayProduct.descriptionBlocks.length > 0 ? (
                  displayProduct.descriptionBlocks.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Thông tin mô tả đang được cập nhật.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviewsTab />
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="border-t border-slate-200 pt-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-extrabold text-slate-950 text-xl tracking-tight">Sản phẩm liên quan</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Các sản phẩm khác cùng danh mục hoặc gần nhất trong cửa hàng</p>
            </div>
            <a href="/products" className="text-xs font-bold text-slate-900 hover:text-slate-700 transition-colors flex items-center gap-1">
              Xem tất cả →
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-400">
                Chưa có sản phẩm liên quan để hiển thị.
              </div>
            )}
          </div>
        </div>
          </>
        ) : null}

      </div>

      {/* Compare Selection Modal */}
      {product && (
        <CompareSelectionModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          currentProduct={product}
          onSelect={(selectedProduct) => {
            setIsCompareModalOpen(false);
            navigate(`/compare?ids=${product.id},${selectedProduct.id}`);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default ProductDetail;
