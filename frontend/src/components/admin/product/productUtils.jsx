import { ChevronDown, ChevronUp } from "lucide-react";

import { api } from "@/lib/api";

export const resolveAssetUrl = (value) => {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^\/\//.test(value)) {
    return `http:${value}`;
  }

  const apiBaseUrl = api.defaults.baseURL ?? "";
  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

  try {
    return new URL(value, `${apiOrigin}/`).toString();
  } catch {
    return `${apiOrigin}${value.startsWith("/") ? value : `/${value}`}`;
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
  if (typeof specPreview === "string") {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{specPreview}</p>
      </div>
    );
  }

  if (Array.isArray(specPreview) && specPreview.length > 0 && typeof specPreview[0] !== "object") {
    return (
      <div className="grid gap-3">
        {specPreview.map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(specPreview) && specPreview.length > 0 && typeof specPreview[0] === "object" && specPreview[0] !== null) {
    const columns = Array.from(
      specPreview.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set())
    );

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
            {specPreview.map((row, rowIndex) => (
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
      {JSON.stringify(specPreview, null, 2)}
    </pre>
  );
}

export function SpecPreviewToggle({ isOpen, onToggle }) {
  return (
    <span className="inline-flex size-8 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
    </span>
  );
}
