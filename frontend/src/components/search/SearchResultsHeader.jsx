import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

export default function SearchResultsHeader({
  query,
  resultCount,
  sortBy,
  onSortChange,
}) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="m-0 text-[36px] font-black leading-tight tracking-normal text-slate-950 sm:text-[42px]">
          Kết quả cho '{query}'
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-700">
          {resultCount} kết quả tìm thấy
        </p>
      </div>

      <label className="flex items-center gap-4 text-lg font-medium text-slate-700">
        Sắp xếp theo:
        <span className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-14 w-60 appearance-none rounded border border-slate-300 bg-white px-5 pr-12 text-base font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        </span>
      </label>
    </section>
  );
}
