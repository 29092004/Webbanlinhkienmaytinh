import {
  calculateDiscountedPrice,
  formatSalePercentage,
  resolveAssetUrl,
} from "@/components/admin/product/productUtils";

const formatCurrency = (value) => Number(value || 0).toLocaleString("vi-VN");

const buildProductDescription = (product) => {
  const segments = [
    product.brand_name,
    product.category_name,
    product.origin,
  ].filter(Boolean);

  if (segments.length > 0) {
    return segments.slice(0, 2).join(" | ");
  }

  return product.warranty || "Linh kiện chính hãng";
};

export const getSaleLabel = (product) => {
  if (!product?.sale_id) {
    return "";
  }

  if (product.sale_type === "fixed") {
    return `-${formatCurrency(product.sale_value)}đ`;
  }

  return `-${formatSalePercentage(product.sale_value)}`;
};

export const mapSaleProductsForHome = (products = []) => {
  const saleProducts = products.filter((product) => Boolean(product.sale_id));
  const maxQuantity = Math.max(...saleProducts.map((product) => Number(product.quantity || 0)), 1);

  return saleProducts.map((product) => {
    const pricing = calculateDiscountedPrice({
      retailPrice: product.retail_price,
      saleType: product.sale_type,
      saleValue: product.sale_value,
      isOnSale: Boolean(product.sale_id),
    });

    return {
      id: product.id,
      name: product.name,
      image: resolveAssetUrl(product.images?.[0]?.url),
      discount: getSaleLabel(product),
      price: formatCurrency(pricing.finalPrice),
      originalPrice: pricing.finalPrice < pricing.basePrice ? formatCurrency(pricing.basePrice) : "",
      quantity: Number(product.quantity || 0),
      progressWidth: `${Math.max(8, Math.round((Number(product.quantity || 0) / maxQuantity) * 100))}%`,
      saleMeta: product.sale_duration ? `${product.sale_duration} ngày` : product.category_name || "Đang sale",
    };
  });
};

export const mapRegularProductsForHome = (products = []) =>
  products
    .filter((product) => !product.sale_id)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      desc: buildProductDescription(product),
      price: formatCurrency(product.retail_price),
      image: resolveAssetUrl(product.images?.[0]?.url),
    }));

export const mapCategoryProductsForHome = (products = [], categoryNames = []) => {
  const normalizedCategoryNames = categoryNames.map((name) => name.trim().toLowerCase());

  return products
    .filter((product) => normalizedCategoryNames.includes(String(product.category_name || "").trim().toLowerCase()))
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      desc: buildProductDescription(product),
      price: formatCurrency(product.retail_price),
      image: resolveAssetUrl(product.images?.[0]?.url),
    }));
};
