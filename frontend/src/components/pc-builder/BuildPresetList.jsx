import BuildPresetCard from "./BuildPresetCard";

export default function BuildPresetList({ builds }) {
  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="m-0 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
        Cấu hình gợi ý cho bạn
      </h2>
      <p className="mt-3 text-sm font-medium text-slate-600">
        Các cấu hình được chọn lọc phù hợp với nhu cầu và ngân sách của bạn
      </p>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {builds.map((build) => (
          <BuildPresetCard key={build.id} build={build} />
        ))}
      </div>

      <button
        type="button"
        className="mx-auto mt-7 flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
      >
        + Xem thêm cấu hình khác
      </button>
    </section>
  );
}
