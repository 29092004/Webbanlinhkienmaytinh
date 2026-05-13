import { Plus, Download } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { ProductFilters } from "../components/admin/products/product-manager/ProductFilters";
import { ProductTable } from "../components/admin/products/product-manager/ProductTable";
import { AdminFooter } from "../components/admin/layout/AdminFooter";

function AdminProducts() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-grow p-8 max-w-7xl mx-auto w-full flex flex-col">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Products</h1>
              <p className="text-sm text-gray-500">Manage your product catalog, inventory, and pricing.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>

          {/* Product Management Area */}
          <div className="flex-grow flex flex-col mb-8">
            <ProductFilters />
            <ProductTable />
          </div>

          <AdminFooter />
        </main>
      </div>
    </div>
  );
}

export default AdminProducts;
