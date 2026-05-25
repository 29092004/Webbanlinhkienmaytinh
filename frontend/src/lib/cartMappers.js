import { calculateDiscountedPrice, resolveAssetUrl } from "@/components/admin/product/productUtils";

const buildCartItemDetails = (product) => {
  const specs = [];
  const parsedSpecs = product?.specs;

  if (parsedSpecs && typeof parsedSpecs === "object" && !Array.isArray(parsedSpecs)) {
    Object.values(parsedSpecs)
      .filter(Boolean)
      .slice(0, 3)
      .forEach((value) => specs.push(String(value)));
  }

  if (specs.length > 0) {
    return specs.join(" | ");
  }

  return [product?.brand_name, product?.category_name, product?.origin].filter(Boolean).join(" | ") || "San pham chinh hang";
};

export const mapCartEntriesToItems = (cartEntries = [], products = []) => {
  const productsById = new Map(products.map((product) => [Number(product.id), product]));

  return cartEntries.flatMap((entry) =>
    (entry.items || []).map((item, index) => {
      const product = productsById.get(Number(item.product_id));
      const pricing = calculateDiscountedPrice({
        retailPrice: product?.retail_price,
        saleType: product?.sale_type === "fixed" ? "fixed" : "percentage",
        saleValue: product?.sale_value,
        isOnSale: Boolean(product?.sale_id),
      });

      return {
        id: `${entry.id}-${item.product_id}-${index}`,
        cartId: entry.id,
        customerId: entry.customer_id,
        productId: Number(item.product_id),
        name: product?.name || item.product_name || "San pham",
        details: buildCartItemDetails(product),
        price: pricing.finalPrice || 0,
        originalPrice: pricing.finalPrice < pricing.basePrice ? pricing.basePrice : null,
        quantity: Number(item.quantity || 1),
        image: resolveAssetUrl(product?.images?.[0]?.url),
        rawProduct: product || null,
      };
    })
  );
};

export const mapCartSuggestions = (products = [], cartItems = []) => {
  const cartProductIds = new Set(cartItems.map((item) => Number(item.productId)));

  return products
    .filter((product) => !cartProductIds.has(Number(product.id)))
    .slice(0, 4)
    .map((product) => {
      const pricing = calculateDiscountedPrice({
        retailPrice: product.retail_price,
        saleType: product.sale_type === "fixed" ? "fixed" : "percentage",
        saleValue: product.sale_value,
        isOnSale: Boolean(product.sale_id),
      });

      return {
        id: product.id,
        name: product.name,
        price: pricing.finalPrice || 0,
        image: resolveAssetUrl(product.images?.[0]?.url),
      };
    });
};

export const mapGuestCartItems = (guestItems = [], products = []) => {
  const productsById = new Map(products.map((product) => [Number(product.id), product]));

  return guestItems.map((item) => {
    const product = productsById.get(Number(item.productId));
    const pricing = calculateDiscountedPrice({
      retailPrice: product?.retail_price,
      saleType: product?.sale_type === "fixed" ? "fixed" : "percentage",
      saleValue: product?.sale_value,
      isOnSale: Boolean(product?.sale_id),
    });

    return {
      id: `guest-${item.productId}`,
      cartId: null,
      customerId: null,
      productId: Number(item.productId),
      name: product?.name || "San pham",
      details: buildCartItemDetails(product),
      price: pricing.finalPrice || 0,
      originalPrice: pricing.finalPrice < pricing.basePrice ? pricing.basePrice : null,
      quantity: Number(item.quantity || 1),
      image: resolveAssetUrl(product?.images?.[0]?.url),
      rawProduct: product || null,
    };
  });
};
