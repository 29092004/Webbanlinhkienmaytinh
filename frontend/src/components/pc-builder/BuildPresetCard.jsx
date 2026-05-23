const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

export default function BuildPresetCard({ build }) {
  return (
    <article
      className={`grid grid-cols-[90px_minmax(0,1fr)] gap-5 rounded-lg border p-5 ${
        build.selected
          ? "border-blue-700 bg-blue-50/20"
          : "border-slate-200 bg-white"
      }`}
    >
      <img
        src={build.image}
        alt={build.name}
        className="size-20 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <h3
          className={`m-0 text-base font-black ${
            build.selected ? "text-blue-700" : "text-slate-950"
          }`}
        >
          {build.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-600">
          {build.description}
        </p>
        <p className="mt-3 text-lg font-black text-slate-950">
          ~ {formatCurrency(build.price)}
        </p>
        <button
          type="button"
          className={`mt-4 h-10 w-full rounded-lg text-sm font-bold transition ${
            build.selected
              ? "bg-blue-700 text-white hover:bg-blue-800"
              : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
          }`}
        >
          {build.selected ? "Đang chọn" : "Xem chi tiết"}
        </button>
      </div>
    </article>
  );
}
