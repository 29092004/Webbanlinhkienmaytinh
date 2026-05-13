import { Search, SlidersHorizontal } from "lucide-react";

export function ProductFilters() {
  return (
    <div className="bg-white p-5 rounded-t-2xl border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer w-full md:w-auto font-medium">
          <option value="">All Categories</option>
          <option value="gpu">GPU</option>
          <option value="cpu">CPU</option>
          <option value="ram">RAM</option>
          <option value="mb">Motherboard</option>
        </select>
        
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer w-full md:w-auto font-medium">
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden md:inline">Filters</span>
        </button>
      </div>
    </div>
  );
}
