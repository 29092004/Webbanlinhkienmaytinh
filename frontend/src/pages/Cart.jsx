import { useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const initialCartItems = [
  {
    id: 1,
    name: "ASUS ROG Strix RTX 4090 OC",
    details: "24GB GDDR6X | Triple Fan | Aura Sync RGB",
    price: 45500000,
    originalPrice: 48900000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X3D",
    details: "16 Cores | 32 Threads | 144MB Cache",
    price: 16200000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Corsair Dominator Platinum 32GB",
    details: "DDR5 6000MHz | CL30 | RGB Lighting",
    price: 4850000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  }
];

const mockSuggestions = [
  {
    id: 201,
    name: "ASUS ProArt 32\" 4K HDR",
    price: 18450000,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 202,
    name: "Keychron Q1 Max Custom",
    price: 4200000,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 203,
    name: "Logitech G Pro X Superlight",
    price: 3150000,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 204,
    name: "SteelSeries Arctis Nova Pro",
    price: 8600000,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  }
];

function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedIds, setSelectedIds] = useState(initialCartItems.map(item => item.id));

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter(itemId => itemId !== id));
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  };


  const handleAddSuggestionToCart = (product) => {
    const newId = Date.now();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: newId,
          name: product.name,
          details: "Premium Accessory | High Performance",
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
    setSelectedIds((prev) => [...prev, newId]);
  };

  // Math Calculations (Based on selected products only)
  const rawSubtotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedIds.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems, selectedIds]);

  const subtotal = rawSubtotal;
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng" },
          ]}
        />

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {cartItems.length} sản phẩm — Kiểm tra lại sản phẩm trước khi thanh toán
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-5">
            <div className="size-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-gray-900 text-lg">Giỏ hàng của bạn trống!</h3>
              <p className="text-gray-500 text-xs font-semibold">
                Hãy chọn thêm linh kiện chất lượng cao và quay lại sau nhé.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-6 text-xs font-bold transition-colors uppercase"
            >
              QUAY LẠI CỬA HÀNG
            </Link>
          </div>
        ) : (
          /* Shopping Layout grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart items */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Select All Checkbar */}
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-bold text-slate-700">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isAllSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-200 hover:border-blue-500 bg-white"
                    }`}
                  >
                    {isAllSelected && (
                      <svg className="size-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </button>
                  <span>CHỌN TẤT CẢ ({cartItems.length} SẢN PHẨM)</span>
                </label>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCartItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
                      setSelectedIds([]);
                    }}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
                  >
                    Xóa mục đã chọn ({selectedIds.length})
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={handleToggleSelect}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Continue Shopping Link */}
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-2"
              >
                <ArrowLeft className="size-3.5" />
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Right Column: Order summary */}
            <div className="lg:col-span-4 shrink-0">
              <CartSummary
                subtotal={subtotal}
                vat={vat}
                total={total}
              />
            </div>
          </div>
        )}

        {/* Suggestion Products Section */}
        <div className="border-t border-slate-200 pt-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-black text-gray-900 text-xl tracking-tight">Có thể bạn cũng thích</h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockSuggestions.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col relative group hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden p-2 flex items-center justify-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">
                  {product.name}
                </h3>

                <span className="text-red-600 font-extrabold text-sm mb-4">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>

                <button
                  type="button"
                  onClick={() => handleAddSuggestionToCart(product)}
                  className="mt-auto w-full border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="size-3.5" />
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Cart;
