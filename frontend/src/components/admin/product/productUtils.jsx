/* eslint-disable react-refresh/only-export-components */
import { ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT_IMAGE_BASE_URL = "https://pub-a37bb828e19547c6ac16ab62282dd9e5.r2.dev";

export const resolveAssetUrl = (value) => {
  if (!value) {
    return "";
  }

  const rawValue = String(value).trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  if (/^\/\//.test(rawValue)) {
    return `https:${rawValue}`;
  }

  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL?.trim() || DEFAULT_IMAGE_BASE_URL;
  let normalizedPath = rawValue
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^uploads\/products\//i, "")
    .replace(/^uploads\//i, "")
    .replace(/^products\//i, "");

  try {
    normalizedPath = decodeURIComponent(normalizedPath);
  } catch {
    // Keep the original path when it is not URL encoded.
  }

  if (!imageBaseUrl || !normalizedPath) {
    return normalizedPath;
  }

  try {
    return new URL(normalizedPath, `${imageBaseUrl.replace(/\/+$/, "")}/`).toString();
  } catch {
    return `${imageBaseUrl.replace(/\/+$/, "")}/${normalizedPath}`;
  }
};

export const calculateDiscountedPrice = ({ retailPrice, saleType, saleValue, isOnSale }) => {
  const basePrice = Number(retailPrice || 0);
  const discountValue = Number(saleValue || 0);

  if (!isOnSale || basePrice <= 0 || discountValue <= 0) {
    return {
      basePrice,
      finalPrice: basePrice,
      discountAmount: 0,
    };
  }

  const discountAmount =
    saleType === "fixed"
      ? discountValue
      : Math.round((basePrice * discountValue) / 100);

  return {
    basePrice,
    finalPrice: Math.max(basePrice - discountAmount, 0),
    discountAmount,
  };
};

const parseSaleDate = (value) => {
  if (!value) {
    return null;
  }

  const normalizedValue =
    typeof value === "string" && value.includes(" ") && !value.includes("T")
      ? value.replace(" ", "T")
      : value;
  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const isSaleCurrentlyActive = (product) => {
  if (product?.sale_is_currently_active !== undefined && product?.sale_is_currently_active !== null) {
    return Boolean(Number(product.sale_is_currently_active));
  }

  if (!product?.sale_id) {
    return false;
  }

  if (product?.sale_is_active !== undefined && product?.sale_is_active !== null && !Number(product.sale_is_active)) {
    return false;
  }

  const now = new Date();
  const startDate = parseSaleDate(product?.start_date ?? product?.sale_start_date);
  const endDate = parseSaleDate(product?.end_date ?? product?.sale_end_date);

  if (startDate && startDate > now) {
    return false;
  }

  if (endDate && endDate < now) {
    return false;
  }

  return true;
};

export const formatSalePercentage = (value) => {
  const numericValue = Number(value || 0);

  if (!Number.isFinite(numericValue)) {
    return "0%";
  }

  return `${numericValue.toLocaleString("vi-VN", {
    maximumFractionDigits: 2,
  })}%`;
};

export const createImageSlotFromExisting = (image) => ({
  kind: "existing",
  image,
});

const createImageSlotFromFile = (file) => ({
  kind: "upload",
  file,
});

export const fillImageSlots = (currentSlots, files) => {
  const nextSlots = [...currentSlots];

  files.forEach((file) => {
    const emptyIndex = nextSlots.findIndex((slot) => slot === null);

    if (emptyIndex >= 0) {
      nextSlots[emptyIndex] = createImageSlotFromFile(file);
      return;
    }

    nextSlots.push(createImageSlotFromFile(file));
  });

  return nextSlots;
};

export function renderSpecPreviewContent(specPreview) {
  let normalizedPreview = specPreview;

  if (typeof specPreview === "object" && specPreview !== null && !Array.isArray(specPreview)) {
    normalizedPreview = Object.entries(specPreview).map(([key, val]) => ({
      "Thông số": key,
      "Chi tiết": String(val),
    }));
  }

  if (typeof normalizedPreview === "string") {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{normalizedPreview}</p>
      </div>
    );
  }

  if (Array.isArray(normalizedPreview) && normalizedPreview.length > 0 && typeof normalizedPreview[0] !== "object") {
    return (
      <div className="grid gap-3">
        {normalizedPreview.map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(normalizedPreview) && normalizedPreview.length > 0 && typeof normalizedPreview[0] === "object" && normalizedPreview[0] !== null) {
    const columnsSet = new Set();
    normalizedPreview.forEach((row) => {
      Object.keys(row).forEach((key) => columnsSet.add(key));
    });

    const columns = [];
    if (columnsSet.has("Thông số")) {
      columns.push("Thông số");
      columnsSet.delete("Thông số");
    }
    if (columnsSet.has("Chi tiết")) {
      columns.push("Chi tiết");
      columnsSet.delete("Chi tiết");
    }
    columnsSet.forEach((col) => columns.push(col));

    return (
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {normalizedPreview.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`} className="px-4 py-3 align-top text-slate-600">
                    {String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
      {JSON.stringify(normalizedPreview, null, 2)}
    </pre>
  );
}

export function SpecPreviewToggle({ isOpen }) {
  return (
    <span className="inline-flex size-8 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
    </span>
  );
}

export const normalizeExistingImage = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    return { url: image };
  }
  if (typeof image === "object") {
    return {
      id: image.id ?? image.image_id ?? null,
      url: image.url ?? image.image_path ?? "",
    };
  }
  return null;
};

export const getImageDisplayName = (url, fallback = "") => {
  if (!url) return fallback;
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const sanitizedFileName = fileName.split("?")[0].split("#")[0];
    const displayName = sanitizedFileName.replace(/^\d+-/, "");
    return displayName || sanitizedFileName || fallback;
  } catch {
    return fallback;
  }
};

export const parseStoredSpecs = (specs) => {
  if (specs === null || specs === undefined) {
    return null;
  }
  if (typeof specs === "string") {
    const trimmed = specs.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  return specs;
};
