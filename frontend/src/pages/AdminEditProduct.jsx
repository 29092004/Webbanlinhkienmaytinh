import { Link } from "react-router-dom";
import { Header } from "../components/home/Header";
import { Footer } from "../components/home/Footer";
import { EditBasicInfo } from "../components/admin/products/edit-product/EditBasicInfo";
import { EditMediaAssets } from "../components/admin/products/edit-product/EditMediaAssets";
import { EditPricing } from "../components/admin/products/edit-product/EditPricing";
import { EditInventory } from "../components/admin/products/edit-product/EditInventory";
import { EditPublishing } from "../components/admin/products/edit-product/EditPublishing";
import { EditCategorization } from "../components/admin/products/edit-product/EditCategorization";
import { EditAuditLog } from "../components/admin/products/edit-product/EditAuditLog";

function AdminEditProduct() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-8">
        {/* Top Breadcrumb and Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/products" className="hover:text-gray-900 transition-colors">Products</Link>
              <span>›</span>
              <span className="text-blue-600">Edit Product</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Product: RTX 4090 Titanium Core</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              View on Store
            </button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
              Update Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <EditBasicInfo />
            <EditMediaAssets />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditPricing />
              <EditInventory />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <EditPublishing />
            <EditCategorization />
            <EditAuditLog />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminEditProduct;
