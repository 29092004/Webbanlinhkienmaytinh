export function TopSelling() {
  const products = [
    {
      id: 1,
      name: "RTX 4090 OC",
      sales: "1,240 Units Sold",
      price: "$1,599",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=GPU",
      progress: "85%"
    },
    {
      id: 2,
      name: "Z790 Maximus",
      sales: "840 Units Sold",
      price: "$699",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=MB",
      progress: "60%"
    },
    {
      id: 3,
      name: "Precision M1",
      sales: "2,100 Units Sold",
      price: "$129",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=Mouse",
      progress: "95%"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">Top Selling</h2>
      
      <div className="flex-grow flex flex-col gap-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black rounded-xl p-2 flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-900 leading-none">{product.name}</h3>
                <span className="text-sm font-bold text-blue-600">{product.price}</span>
              </div>
              <div className="text-[11px] text-gray-500 mb-2">{product.sales}</div>
              
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    product.progress === '60%' ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: product.progress }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
        View Full Report
      </button>
    </div>
  );
}
