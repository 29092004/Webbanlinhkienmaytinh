import { RotateCcw } from "lucide-react";

const manufacturers = [
  { label: "NVIDIA Founders Edition", checked: true },
  { label: "ASUS ROG Strix", checked: false },
  { label: "MSI Suprim X", checked: false },
  { label: "Gigabyte Aorus", checked: false },
];

const technicalSpecs = [
  { label: "Water-Cooled", checked: false },
  { label: "Overclocked Edition", checked: true },
  { label: "Triple Fan", checked: false },
];

export default function SearchFilters() {
  return (
    <aside className="space-y-9">
      <FilterGroup title="Hãng sản xuất">
        <div className="space-y-4">
          {manufacturers.map((item) => (
            <FilterCheckbox key={item.label} {...item} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Khoảng giá (VND)">
        <div className="space-y-6">
          <div className="relative h-5">
            <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />
            <div className="absolute left-[54%] top-1/2 size-5 -translate-y-1/2 rounded-full bg-blue-700 shadow-sm" />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex h-11 items-center justify-center border border-slate-300 bg-white text-lg font-medium text-slate-950">
              40M
            </div>
            <span className="text-slate-500">-</span>
            <div className="flex h-11 items-center justify-center border border-slate-300 bg-white text-lg font-medium text-slate-950">
              100M
            </div>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Thông số kỹ thuật">
        <div className="space-y-4">
          {technicalSpecs.map((item) => (
            <FilterCheckbox key={item.label} {...item} />
          ))}
        </div>
      </FilterGroup>

      <button
        type="button"
        className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-slate-200 text-lg font-medium text-slate-700 transition hover:bg-slate-300"
      >
        <RotateCcw className="size-5" />
        Làm mới bộ lọc
      </button>
    </aside>
  );
}

function FilterGroup({ title, children }) {
  return (
    <section>
      <h2 className="m-0 mb-5 text-base font-black uppercase tracking-[0.12em] text-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FilterCheckbox({ label, checked }) {
  return (
    <label className="flex cursor-pointer items-center gap-4 text-lg font-medium text-slate-700">
      <input
        type="checkbox"
        defaultChecked={checked}
        className="size-6 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
      />
      {label}
    </label>
  );
}
