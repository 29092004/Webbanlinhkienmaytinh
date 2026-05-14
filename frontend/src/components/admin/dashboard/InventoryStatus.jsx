export function InventoryStatus() {
  const inventoryData = [
    { label: "Card đồ họa (VGA)", status: "Thấp", count: 12, color: "bg-red-500", percentage: 25 },
    { label: "Bộ vi xử lý (CPU)", status: "Bình thường", count: 45, color: "bg-blue-500", percentage: 55 },
    { label: "Bộ nhớ (RAM)", status: "Đầy đủ", count: 120, color: "bg-emerald-500", percentage: 85 },
    { label: "Bo mạch chủ (Mainboard)", status: "Ổn định", count: 32, color: "bg-indigo-500", percentage: 40 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Tình trạng kho</h2>
      
      <div className="flex flex-col gap-6">
        {inventoryData.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-gray-700">{item.label}</span>
              </div>
              <span className={`text-[11px] font-bold ${
                item.status === 'Thấp' ? 'text-rose-600' : 'text-gray-500'
              }`}>
                {item.status}: {item.count} cái
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
