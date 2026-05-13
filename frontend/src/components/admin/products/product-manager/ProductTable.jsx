import { Edit, Trash2, MoreVertical } from "lucide-react";

export function ProductTable() {
  const products = [
    {
      id: "PRD-001",
      name: "ASUS ROG Strix RTX 4090 OC Edition",
      sku: "ROG-STRIX-RTX-4090",
      category: "GPU",
      price: "$1,599.00",
      stock: 45,
      status: "Active",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=4090"
    },
    {
      id: "PRD-002",
      name: "AMD Ryzen 9 7950X3D Processor",
      sku: "AMD-R9-7950X3D",
      category: "CPU",
      price: "$599.00",
      stock: 12,
      status: "Active",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=CPU"
    },
    {
      id: "PRD-003",
      name: "Corsair Dominator Platinum 32GB",
      sku: "COR-DOM-32GB-6000",
      category: "RAM",
      price: "$189.00",
      stock: 0,
      status: "Out of Stock",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=RAM"
    },
    {
      id: "PRD-004",
      name: "ASUS ROG Maximus Z790 Hero",
      sku: "ROG-MAX-Z790",
      category: "Motherboard",
      price: "$629.00",
      stock: 8,
      status: "Active",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=MB"
    },
    {
      id: "PRD-005",
      name: "Samsung 990 Pro 2TB NVMe",
      sku: "SAM-990-PRO-2TB",
      category: "Storage",
      price: "$169.00",
      stock: 124,
      status: "Active",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=SSD"
    },
    {
      id: "PRD-006",
      name: "Custom RGB Strip Kit (Unreleased)",
      sku: "EXO-RGB-KIT-01",
      category: "Accessories",
      price: "$39.00",
      stock: 500,
      status: "Draft",
      image: "https://placehold.co/100x100/1e293b/ffffff?text=RGB"
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-b-2xl border-x border-b border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 p-1 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 mb-0.5">{product.name}</div>
                      <div className="text-[11px] text-gray-500 font-medium">SKU: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 font-medium">{product.category}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">{product.price}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-600">
                  <span className={product.stock === 0 ? 'text-rose-500 font-bold' : 'text-gray-900'}>{product.stock}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden" title="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">6</span> of <span className="font-bold text-gray-900">142</span> results
        </div>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">1</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">2</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">3</button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
