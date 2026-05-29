import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { api } from "@/lib/api";
import { getStoredUser, isAuthenticated } from "@/lib/auth";
import { mapCartEntriesToItems, mapCartSuggestions, mapGuestCartItems } from "@/lib/cartMappers";
import {
  addProductToCart,
  clearGuestCart,
  clearServerCart,
  fetchServerCartEntries,
  getGuestCartItems,
  notifyCartStateChanged,
  removeGuestCartItem,
  saveGuestCartItems,
  updateGuestCartItemQuantity,
} from "@/lib/cartStore";
import { showToast } from "@/lib/toast";

function Cart() {
  const [cartEntries, setCartEntries] = useState([]);
  const [guestCartEntries, setGuestCartEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const user = getStoredUser();
  const customerId = Number(user?.id || 0);
  const isLoggedIn = isAuthenticated() && customerId > 0;

  const cartItems = useMemo(
    () => (isLoggedIn ? mapCartEntriesToItems(cartEntries, products) : mapGuestCartItems(guestCartEntries, products)),
    [cartEntries, guestCartEntries, isLoggedIn, products]
  );

  const suggestions = useMemo(
    () => mapCartSuggestions(products, cartItems),
    [products, cartItems]
  );

  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = cartItems.map((item) => item.id);

      if (prev.length === 0) {
        return currentIds;
      }

      const nextSelected = prev.filter((id) => currentIds.includes(id));
      return nextSelected.length > 0 ? nextSelected : currentIds;
    });
  }, [cartItems]);

  useEffect(() => {
    let isMounted = true;

    const fetchCartData = async () => {
      if (!isLoggedIn) {
        try {
          setIsLoading(true);
          setError("");
          const productResponse = await api.get("/products");

          if (!isMounted) {
            return;
          }

          setCartEntries([]);
          setGuestCartEntries(getGuestCartItems());
          setProducts(Array.isArray(productResponse.data?.data) ? productResponse.data.data : []);
        } catch (nextError) {
          if (!isMounted) {
            return;
          }

          console.error("Failed to fetch guest cart products", nextError);
          setError("Khong the tai gio hang luc nay.");
          setCartEntries([]);
          setGuestCartEntries([]);
          setProducts([]);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [cartRows, productResponse] = await Promise.all([
          fetchServerCartEntries(customerId),
          api.get("/products"),
        ]);

        if (!isMounted) {
          return;
        }

        setCartEntries(Array.isArray(cartRows) ? cartRows : []);
        setGuestCartEntries([]);
        setProducts(Array.isArray(productResponse.data?.data) ? productResponse.data.data : []);
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch cart", nextError);
        setError("Khong the tai gio hang luc nay.");
        setCartEntries([]);
        setGuestCartEntries([]);
        setProducts([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCartData();

    return () => {
      isMounted = false;
    };
  }, [customerId, isLoggedIn]);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1 || isUpdating) return;

    if (!isLoggedIn) {
      const nextItems = updateGuestCartItemQuantity(item.productId, newQty);
      setGuestCartEntries(nextItems);
      return;
    }

    try {
      setIsUpdating(true);
      await api.put(`/carts/${item.cartId}`, {
        customerId: item.customerId,
        items: [
          {
            productId: item.productId,
            quantity: newQty,
          },
        ],
      });

      setCartEntries((prev) =>
        prev.map((entry) =>
          entry.id === item.cartId
            ? {
                ...entry,
                items: (entry.items || []).map((entryItem) =>
                  Number(entryItem.product_id) === Number(item.productId)
                    ? { ...entryItem, quantity: newQty }
                    : entryItem
                ),
              }
            : entry
        )
      );
      notifyCartStateChanged();
    } catch (nextError) {
      console.error("Failed to update cart quantity", nextError);
      showToast({ message: "Không cập nhật được số lượng sản phẩm.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (item) => {
    if (isUpdating) return;

    if (!isLoggedIn) {
      const nextItems = removeGuestCartItem(item.productId);
      setGuestCartEntries(nextItems);
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== item.id));
      return;
    }

    try {
      setIsUpdating(true);
      await api.delete(`/carts/${item.cartId}`);
      setCartEntries((prev) => prev.filter((entry) => entry.id !== item.cartId));
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== item.id));
      notifyCartStateChanged();
    } catch (nextError) {
      console.error("Failed to remove cart item", nextError);
      showToast({ message: "Không xóa được sản phẩm khỏi giỏ hàng.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
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

  const handleClearCart = async () => {
    if (isUpdating || cartItems.length === 0) {
      return;
    }

    try {
      setIsUpdating(true);

      if (isLoggedIn) {
        await clearServerCart(customerId);
        setCartEntries([]);
      } else {
        clearGuestCart();
        setGuestCartEntries([]);
      }

      setSelectedIds([]);
      showToast({ message: "Đã xóa toàn bộ giỏ hàng." });
    } catch (nextError) {
      console.error("Failed to clear cart", nextError);
      showToast({ message: "Không xóa được toàn bộ giỏ hàng.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };


  const handleAddSuggestionToCart = async (product) => {
    if (isUpdating) {
      return;
    }

    const existing = cartItems.find((item) => Number(item.productId) === Number(product.id));

    if (existing) {
      await handleQuantityChange(existing, existing.quantity + 1);
      return;
    }

    try {
      setIsUpdating(true);
      await addProductToCart({ productId: product.id, quantity: 1 });

      if (!isLoggedIn) {
        setGuestCartEntries(getGuestCartItems());
      } else if (existing) {
        setCartEntries((prev) =>
          prev.map((entry) =>
            entry.id === existing.cartId
              ? {
                  ...entry,
                  items: (entry.items || []).map((entryItem) =>
                    Number(entryItem.product_id) === Number(product.id)
                      ? { ...entryItem, quantity: Number(entryItem.quantity || 0) + 1 }
                      : entryItem
                  ),
                }
              : entry
          )
        );
      } else {
        const refreshedEntries = await fetchServerCartEntries(customerId);
        setCartEntries(refreshedEntries);
      }
    } catch (nextError) {
      console.error("Failed to add suggestion to cart", nextError);
      showToast({ message: "Không thêm được sản phẩm vào giỏ hàng.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  // Math Calculations (Based on selected products only)
  const rawSubtotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedIds.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems, selectedIds]);

  const subtotal = rawSubtotal;
  const total = subtotal;

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
          <h1 className="text-[1.9rem] font-black uppercase tracking-[-0.02em] text-slate-950 md:text-[2.2rem]">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {cartItems.length} sản phẩm - Kiểm tra lại sản phẩm trước khi thanh toán
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-3">
            <h3 className="font-bold text-gray-900 text-lg tracking-[-0.01em]">Đang tải giỏ hàng...</h3>
            <p className="text-gray-500 text-xs font-semibold">Chúng mình đang lấy dữ liệu thật từ hệ thống.</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-rose-100 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-3">
            <h3 className="font-bold text-rose-500 text-lg tracking-[-0.01em]">{error}</h3>
            <p className="text-gray-500 text-xs font-semibold">Vui lòng thử lại sau.</p>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-5">
            <div className="size-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-lg tracking-[-0.01em]">Giỏ hàng của bạn trống!</h3>
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
                <label className="flex cursor-pointer select-none items-center gap-3 text-sm font-bold text-slate-900">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    disabled={isUpdating}
                    className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isAllSelected
                        ? "bg-red-600 border-red-600 text-white"
                        : "border-slate-300 hover:border-slate-500 bg-white text-white"
                    } ${isUpdating ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {isAllSelected && (
                      <svg className="size-2.5 fill-current text-white" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </button>
                  <span className="text-slate-900">Chọn tất cả ({cartItems.length} sản phẩm)</span>
                </label>

                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      disabled={isUpdating}
                      className="text-sm font-bold text-slate-700 transition hover:text-slate-950 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Xóa toàn bộ
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));
                        try {
                          setIsUpdating(true);
                          if (isLoggedIn) {
                            await Promise.all(selectedItems.map((item) => api.delete(`/carts/${item.cartId}`)));
                            setCartEntries((prev) =>
                              prev.filter(
                                (entry) => !selectedItems.some((item) => Number(item.cartId) === Number(entry.id))
                              )
                            );
                            notifyCartStateChanged();
                          } else {
                            const selectedProductIds = selectedItems.map((item) => Number(item.productId));
                            const nextGuestItems = getGuestCartItems().filter(
                              (item) => !selectedProductIds.includes(Number(item.productId))
                            );
                            saveGuestCartItems(nextGuestItems);
                            setGuestCartEntries(nextGuestItems);
                          }
                          setSelectedIds([]);
                        } catch (nextError) {
                          console.error("Failed to remove selected cart items", nextError);
                          showToast({ message: "Không xóa được các sản phẩm đã chọn.", type: "error" });
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                      className="text-sm font-bold text-red-600 transition hover:text-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Xóa mục đã chọn ({selectedIds.length})
                    </button>
                  </div>
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
                    disabled={isUpdating}
                  />
                ))}
              </div>

              {/* Continue Shopping Link */}
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-slate-900 transition-colors hover:text-slate-700"
              >
                <ArrowLeft className="size-3.5" />
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Right Column: Order summary */}
            <div className="lg:col-span-4 shrink-0">
              <CartSummary
                subtotal={subtotal}
                total={total}
              />
            </div>
          </div>
        )}

        {/* Suggestion Products Section */}
        <div className="border-t border-slate-200 pt-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-xl tracking-[-0.01em]">Có thể bạn cũng thích</h2>
            </div>
            <Link to="/products" className="text-sm font-bold text-slate-900 transition-colors hover:text-slate-700">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col relative group hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden p-2 flex items-center justify-center mb-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full rounded group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-slate-100 text-slate-400 text-xs font-semibold">
                      Chua co hinh anh
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">
                  {product.name}
                </h3>

                <span className="text-red-600 font-bold text-sm mb-4">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>

                <button
                  type="button"
                  onClick={() => handleAddSuggestionToCart(product)}
                  disabled={isUpdating}
                  className="mt-auto w-full border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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
