export function OrderItemsList() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Item 1 */}
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0f172a] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 p-1">
                    <img src="https://placehold.co/100x100/0f172a/ffffff?text=GPU" alt="GPU" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">EXO-Alpha X1 GPU</h3>
                    <p className="text-xs text-gray-500">Ray Tracing Edition - 24GB</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-gray-500">EXO-GPU-X1-RTX</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm text-gray-700">$1,299.00</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-gray-700">1</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-900">$1,299.00</span>
              </td>
            </tr>

            {/* Item 2 */}
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0f172a] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 p-1">
                    <img src="https://placehold.co/100x100/0f172a/ffffff?text=CPU" alt="CPU" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">EXO Core i9 Quantum</h3>
                    <p className="text-xs text-gray-500">16-Core / 32-Thread</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-gray-500">EXO-CPU-I9-QN</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm text-gray-700">$599.00</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-gray-700">1</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-900">$599.00</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-white border-t border-gray-200 p-6 flex flex-col items-end">
        <div className="w-full max-w-sm space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>$1,898.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping (Express)</span>
            <span>$25.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 pb-4 border-b border-gray-100">
            <span>Estimated Tax (8%)</span>
            <span>$151.84</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-lg font-bold text-blue-600">Total</span>
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">$2,074.84</span>
          </div>
        </div>
      </div>
    </div>
  );
}
