import { Link, useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { CategoryBasicInfoAdd } from "../components/admin/categories/add-category/CategoryBasicInfoAdd";
import { CategorySEOAdd } from "../components/admin/categories/add-category/CategorySEOAdd";
import { CategoryVisibilityAdd } from "../components/admin/categories/add-category/CategoryVisibilityAdd";
import { CategoryThumbnail } from "../components/admin/categories/add-category/CategoryThumbnail";

function AdminAddCategory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative pb-24">
        <AdminHeader />

        <main className="flex-grow p-8 max-w-[1200px] mx-auto w-full flex flex-col">
          {/* Breadcrumb Header */}
          <div className="mb-8">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/categories" className="hover:text-gray-900 transition-colors">Categories</Link>
              <span>›</span>
              <span className="text-blue-600">New Category</span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create New Category</h1>
            <p className="text-sm text-gray-500">Configure structural taxonomies for your high-performance component catalog.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <CategoryBasicInfoAdd />
              <CategorySEOAdd />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <CategoryVisibilityAdd />
              <CategoryThumbnail />
            </div>
          </div>
        </main>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCcw className="w-4 h-4 animate-spin text-blue-500" />
            <span>Auto-saving as draft...</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/categories')}
              className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
              Create Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddCategory;
