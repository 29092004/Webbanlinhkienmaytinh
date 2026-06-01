import {
  calculateDiscountedPrice,
  formatSalePercentage,
  parseStoredSpecs,
  resolveAssetUrl,
} from "@/components/admin/product/productUtils";

const formatCurrency = (value) => Number(value || 0).toLocaleString("vi-VN");
const normalizeSearchText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CATEGORY_QUERY_ALIASES = {
  processors: ["cpu"],
  graphics: ["gpu"],
  storage: ["ssd", "hdd"],
  memory: ["ram"],
  processorss: ["cpu"],
};

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

const buildProductRating = (product) => {
  if (product.sale_id) {
    return 4.9;
  }

  return product.quantity > 0 ? 4.7 : 4.5;
};

export const slugifyCategory = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeCategoryIdsFromQuery = (rawCategory) => {
  const normalized = String(rawCategory || "").trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return CATEGORY_QUERY_ALIASES[normalized] || [normalized];
};

export const normalizeBrandIdsFromQuery = (rawBrand) =>
  String(rawBrand || "")
    .split(",")
    .map((brand) => brand.trim())
    .filter(Boolean);

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
      specs: product.specs,
      warranty: product.warranty,
      origin: product.origin,
      description: product.description,
      sale_id: product.sale_id,
      sale_type: product.sale_type,
      sale_value: product.sale_value,
      sale_start_date: product.start_date || null,
      sale_end_date: product.end_date || null,
      sale_is_active: Boolean(product.sale_is_active),
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
      specs: product.specs,
      warranty: product.warranty,
      origin: product.origin,
      quantity: product.quantity,
      description: product.description,
    }));

export const mapCategoryProductsForHome = (products = [], categoryNames = []) => {
  const normalizedCategoryNames = categoryNames.map((name) => name.trim().toLowerCase());

  return products
    .filter((product) => !product.sale_id)
    .filter((product) => normalizedCategoryNames.includes(String(product.category_name || "").trim().toLowerCase()))
    .slice(0, 10)
    .map((product) => {
      const pricing = calculateDiscountedPrice({
        retailPrice: product.retail_price,
        saleType: product.sale_type,
        saleValue: product.sale_value,
        isOnSale: Boolean(product.sale_id),
      });

      return {
        id: product.id,
        name: product.name,
        desc: buildProductDescription(product),
        price: formatCurrency(pricing.finalPrice),
        originalPrice: pricing.finalPrice < pricing.basePrice ? formatCurrency(pricing.basePrice) : "",
        discount: getSaleLabel(product),
        image: resolveAssetUrl(product.images?.[0]?.url),
        specs: product.specs,
        warranty: product.warranty,
        origin: product.origin,
        quantity: product.quantity,
        description: product.description,
        sale_id: product.sale_id,
        sale_type: product.sale_type,
        sale_value: product.sale_value,
      };
    });
};

export const mapProductForListing = (product) => {
  const salePricing = calculateDiscountedPrice({
    retailPrice: product.retail_price,
    saleType: product.sale_type === "fixed" ? "fixed" : "percentage",
    saleValue: product.sale_value,
    isOnSale: Boolean(product.sale_id),
  });

  return {
    id: product.id,
    name: product.name,
    brand: product.brand_name || "Khac",
    category: slugifyCategory(product.category_name),
    price: salePricing.finalPrice,
    originalPrice: salePricing.finalPrice < salePricing.basePrice ? salePricing.basePrice : null,
    isOnSale: Boolean(product.sale_id) && salePricing.finalPrice < salePricing.basePrice,
    rating: buildProductRating(product),
    reviewsCount: Number(product.quantity || 0),
    image: resolveAssetUrl(product.images?.[0]?.url),
    specs: product.specs,
    warranty: product.warranty,
    origin: product.origin,
    quantity: product.quantity,
    description: product.description,
    sale_id: product.sale_id,
    sale_type: product.sale_type,
    sale_value: product.sale_value,
  };
};

export const mapAvailableCategories = (products = []) =>
  Array.from(
    new Map(
      products.map((product) => {
        const id = slugifyCategory(product.category_name);

        return [
          id,
          {
            id,
            label: product.category_name || "Khac",
          },
        ];
      })
    ).values()
  ).sort((left, right) => left.label.localeCompare(right.label, "vi"));

export const mapAvailableBrands = (products = []) =>
  Array.from(
    new Map(
      products.map((product) => [
        product.brand_name || "Khac",
        {
          id: product.brand_name || "Khac",
          label: product.brand_name || "Khac",
        },
      ])
    ).values()
  ).sort((left, right) => left.label.localeCompare(right.label, "vi"));

export const mapProductForSearch = (product) => {
  const salePricing = calculateDiscountedPrice({
    retailPrice: product.retail_price,
    saleType: product.sale_type === "fixed" ? "fixed" : "percentage",
    saleValue: product.sale_value,
    isOnSale: Boolean(product.sale_id),
  });
  const parsedSpecs = parseStoredSpecs(product.specs);
  const specEntries =
    Array.isArray(parsedSpecs) && parsedSpecs.length > 0
      ? parsedSpecs
          .slice(0, 2)
          .map((item, index) => {
            if (typeof item === "object" && item !== null) {
              const label = item["Thông số"] || item.label || item.name || `Thông số ${index + 1}`;
              const value =
                item["Chi tiết"] ||
                item.value ||
                Object.values(item)
                  .slice(1)
                  .join(" | ");

              return { label, value: String(value || "Đang cập nhật") };
            }

            return { label: `Thông số ${index + 1}`, value: String(item) };
          })
      : [
          { label: "Danh mục", value: product.category_name || "Đang cập nhật" },
          { label: "Bảo hành", value: product.warranty ? `${product.warranty} tháng` : "Đang cập nhật" },
        ];

  return {
    id: product.id,
    brand: product.brand_name || "Sản phẩm",
    name: product.name,
    price: salePricing.finalPrice,
    image: resolveAssetUrl(product.images?.[0]?.url),
    specs: specEntries,
    originalProduct: product,
  };
};

export const searchProductsByName = (products = [], rawQuery = "") => {
  const normalizedQuery = normalizeSearchText(rawQuery);

  if (!normalizedQuery) {
    return products;
  }

  const queryTerms = normalizedQuery.split(" ").filter(Boolean);

  return products
    .map((product) => {
      const normalizedName = normalizeSearchText(product.name);
      const normalizedBrand = normalizeSearchText(product.brand_name || product.brand);
      const normalizedCategory = normalizeSearchText(product.category_name || product.category);
      const searchBlob = `${normalizedName} ${normalizedBrand} ${normalizedCategory}`.trim();
      let score = 0;

      if (normalizedName === normalizedQuery) {
        score += 1000;
      } else if (normalizedName.startsWith(normalizedQuery)) {
        score += 800;
      } else if (normalizedName.includes(normalizedQuery)) {
        score += 650;
      } else if (searchBlob.includes(normalizedQuery)) {
        score += 500;
      }

      const matchedTerms = queryTerms.filter((term) => searchBlob.includes(term));
      score += matchedTerms.length * 120;

      if (queryTerms.every((term) => normalizedName.includes(term))) {
        score += 220;
      }

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return Number(right.product.id || 0) - Number(left.product.id || 0);
    })
    .map((entry) => entry.product);
};

export const normalizeSpecsForTable = (rawSpecs, product) => {
  const parsedSpecs = parseStoredSpecs(rawSpecs);

  if (Array.isArray(parsedSpecs)) {
    if (parsedSpecs.length > 0 && typeof parsedSpecs[0] === "object" && parsedSpecs[0] !== null) {
      const nextSpecs = {};

      parsedSpecs.forEach((row, index) => {
        const key = row["Thông số"] || row.label || row.name || `Thông số ${index + 1}`;
        const value =
          row["Chi tiết"] ||
          row.value ||
          Object.entries(row)
            .filter(([entryKey]) => entryKey !== "Thông số" && entryKey !== "Chi tiết")
            .map(([, entryValue]) => String(entryValue))
            .join(" | ");

        nextSpecs[key] = value || "Dang cap nhat";
      });

      return nextSpecs;
    }

    return parsedSpecs.reduce((accumulator, item, index) => {
      accumulator[`Thông số ${index + 1}`] = String(item);
      return accumulator;
    }, {});
  }

  if (typeof parsedSpecs === "object" && parsedSpecs !== null) {
    return parsedSpecs;
  }

  return {
    "Thương hiệu": product.brand_name || "Dang cap nhat",
    "Danh mục": product.category_name || "Dang cap nhat",
    "Xuất xứ": product.origin || "Dang cap nhat",
    "Bảo hành": product.warranty ? `${product.warranty} tháng` : "Dang cap nhat",
    "Tồn kho": `${Number(product.quantity || 0)} sản phẩm`,
  };
};

export const mapProductDetailForView = (product) => {
  if (!product) {
    return null;
  }

  const pricing = calculateDiscountedPrice({
    retailPrice: product.retail_price,
    saleType: product.sale_type === "fixed" ? "fixed" : "percentage",
    saleValue: product.sale_value,
    isOnSale: Boolean(product.sale_id),
  });

  const descriptionBlocks = [
    product.description,
    product.origin ? `Xuất xứ: ${product.origin}.` : "",
    product.warranty ? `Bảo hành: ${product.warranty} tháng.` : "",
    product.quantity !== undefined ? `Tồn kho hiện tại: ${product.quantity}.` : "",
  ].filter(Boolean);

  return {
    id: product.id,
    name: product.name,
    brand: product.brand_name || "Dang cap nhat",
    categoryName: product.category_name || "San pham",
    sku: `SP-${String(product.id).padStart(4, "0")}`,
    price: pricing.finalPrice,
    originalPrice: pricing.finalPrice < pricing.basePrice ? pricing.basePrice : null,
    rating: buildProductRating(product),
    reviewsCount: Number(product.quantity || 0),
    soldText: `${Number(product.quantity || 0)} trong kho`,
    images: (product.images || []).map((image) => resolveAssetUrl(image?.url)).filter(Boolean),
    specs: normalizeSpecsForTable(product.specs, product),
    descriptionBlocks,
  };
};

export const mapRelatedProduct = (product) => {
  const salePricing = calculateDiscountedPrice({
    retailPrice: product.retail_price,
    saleType: product.sale_type === "fixed" ? "fixed" : "percentage",
    saleValue: product.sale_value,
    isOnSale: Boolean(product.sale_id),
  });

  return {
    id: product.id,
    name: product.name,
    price: salePricing.finalPrice,
    originalPrice: salePricing.finalPrice < salePricing.basePrice ? salePricing.basePrice : null,
    rating: buildProductRating(product),
    reviewsCount: Number(product.quantity || 0),
    image: resolveAssetUrl(product.images?.[0]?.url),
  };
};
