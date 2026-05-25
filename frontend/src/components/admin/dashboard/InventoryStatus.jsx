export function InventoryStatus({ inventoryData = [] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h2 className="mb-6 text-lg font-bold text-gray-900">Tình trạng kho</h2>

      <div className="flex flex-col gap-6">
        {inventoryData.length > 0 ? (
          inventoryData.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-gray-700">{item.label}</span>
                </div>
                <span className={`text-[11px] font-bold ${item.textColor}`}>
                  {item.status}: {item.count} cái
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Chưa có dữ liệu tồn kho để hiển thị.
          </div>
        )}
      </div>
    </div>
  );
}
