import { Link, useNavigate } from "react-router-dom";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { AdminFooter } from "../components/admin/layout/AdminFooter";
import { CategoryBasicInfoEdit } from "../components/admin/categories/edit-category/CategoryBasicInfoEdit";
import { CategoryBannerMedia } from "../components/admin/categories/edit-category/CategoryBannerMedia";
import { CategoryDangerZone } from "../components/admin/categories/edit-category/CategoryDangerZone";
import { CategoryQuickStats } from "../components/admin/categories/edit-category/CategoryQuickStats";
import { CategoryVisibilityEdit } from "../components/admin/categories/edit-category/CategoryVisibilityEdit";
import { CategorySearchPreview } from "../components/admin/categories/edit-category/CategorySearchPreview";

function AdminEditCategory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <AdminHeader />

        <main className="flex-grow p-8 max-w-[1200px] mx-auto w-full flex flex-col">
          {/* Breadcrumb Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                <span>›</span>
                <Link to="/admin/categories" className="hover:text-gray-900 transition-colors">Categories</Link>
                <span>›</span>
                <span className="text-gray-900">Edit Category</span>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Edit Category</h1>
              <p className="text-sm text-gray-500">Configure parameters for the Graphics Cards category.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/categories')}
                className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Discard Changes
              </button>
              <button
                onClick={() => navigate('/admin/categories')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <CategoryBasicInfoEdit />
              <CategoryBannerMedia />
              <CategoryDangerZone />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <CategoryQuickStats />
              <CategoryVisibilityEdit />
              <CategorySearchPreview />
            </div>
          </div>

          <div className="mt-8">
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminEditCategory;
