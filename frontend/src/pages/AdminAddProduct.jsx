import { Link } from "react-router-dom";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { AdminFooter } from "../components/admin/layout/AdminFooter";
import { BasicInfoForm } from "../components/admin/products/add-product/BasicInfoForm";
import { MediaAssetsForm } from "../components/admin/products/add-product/MediaAssetsForm";
import { PricingForm } from "../components/admin/products/add-product/PricingForm";
import { InventoryForm } from "../components/admin/products/add-product/InventoryForm";
import { ProductStatusForm } from "../components/admin/products/add-product/ProductStatusForm";
import { ShippingLogisticsForm } from "../components/admin/products/add-product/ShippingLogisticsForm";
import { OrganizationForm } from "../components/admin/products/add-product/OrganizationForm";

function AdminAddProduct() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative pb-24">
        <AdminHeader />

        <main className="flex-grow p-8 max-w-[1100px] mx-auto w-full flex flex-col relative z-0">
          {/* Breadcrumb Header matching the mockup */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                <span>/</span>
                <Link to="/admin/products" className="hover:text-gray-900 transition-colors">Products</Link>
                <span>/</span>
                <span className="text-gray-900">Add Product</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-1">Configure and publish your high-performance hardware.</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                Discard
              </button>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                Save Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Core Details */}
            <div className="lg:col-span-2">
              <BasicInfoForm />
              <MediaAssetsForm />
              <PricingForm />
              <InventoryForm />
            </div>

            {/* Right Column - Metadata */}
            <div className="lg:col-span-1">
              <ProductStatusForm />
              <ShippingLogisticsForm />
              <OrganizationForm />
            </div>
          </div>

          <div className="mt-8">
            <AdminFooter />
          </div>
        </main>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 px-8 flex items-center justify-between z-10 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-500">Auto-saving draft...</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Discard Changes
            </button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;
