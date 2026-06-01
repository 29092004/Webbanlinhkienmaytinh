import { useState } from "react";
import { Check, X } from "lucide-react";

export function CompareSpecsTable({ products = [] }) {
  const [onlyShowDifferences, setOnlyShowDifferences] = useState(false);

  // Collect all unique spec keys across all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((product) => Object.keys(product.specs || {})))
  );

  // Filter keys if "only show differences" is active
  const displaySpecKeys = onlyShowDifferences && products.length > 1
    ? allSpecKeys.filter((key) => {
        const values = products.map((p) => String(p.specs?.[key] || "").trim().toLowerCase());
        const firstVal = values[0];
        return !values.every((val) => val === firstVal);
      })
    : allSpecKeys;

  // Pad the product columns to always be 3 columns
  const cols = Array.from({ length: 3 }, (_, index) => products[index] || null);

  if (products.length === 0) {
    return null;
  }

  if (allSpecKeys.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-sm font-semibold text-slate-400 shadow-sm">
        Không có thông số kỹ thuật chi tiết để so sánh.
      </div>
    );
  }

  // Helper to render spec values nicely (e.g., boolean checks or standard strings)
  const renderSpecValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-slate-300 font-semibold">—</span>;
    }
    const strVal = String(value).trim();
    if (strVal.toLowerCase() === "có") {
      return (
        <span className="inline-flex items-center justify-center size-5 rounded-full bg-emerald-50 text-emerald-600">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      );
    }
    if (strVal.toLowerCase() === "không") {
      return (
        <span className="inline-flex items-center justify-center size-5 rounded-full bg-rose-50 text-rose-600">
          <X className="size-3.5" strokeWidth={3} />
        </span>
      );
    }
    return <span className="text-slate-800 text-sm font-semibold">{strVal}</span>;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
      {/* Table Title Section with filter toggle */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-slate-900">
            Thông số kỹ thuật chi tiết
          </h3>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {products.length} Sản phẩm
          </span>
        </div>

        {products.length > 1 && (
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-600 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={onlyShowDifferences}
              onChange={(e) => setOnlyShowDifferences(e.target.checked)}
              className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer accent-slate-900"
            />
            Chỉ xem điểm khác biệt
          </label>
        )}
      </div>

      <div className="overflow-x-auto">
        {displaySpecKeys.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-slate-400">
            Các sản phẩm có thông số hoàn toàn giống nhau.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <tbody>
              {displaySpecKeys.map((key, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={key}
                    className={`transition-colors hover:bg-slate-50/50 border-b border-slate-100/60 last:border-b-0 ${
                      isEven ? "bg-slate-50/20" : "bg-white"
                    }`}
                  >
                    {/* Attribute Label */}
                    <td className="w-1/4 py-4 px-6 font-bold text-slate-500 text-xs md:text-sm bg-slate-50/10 border-r border-slate-100/50">
                      {key}
                    </td>

                    {/* Attribute Values for Column 1, 2, 3 */}
                    {cols.map((product, colIdx) => (
                      <td
                        key={product ? product.id : `empty-val-${colIdx}`}
                        className="w-1/4 py-4 px-6 border-r border-slate-100/50 last:border-r-0"
                      >
                        {product ? (
                          renderSpecValue(product.specs?.[key])
                        ) : (
                          <span className="text-slate-200 select-none font-semibold">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
