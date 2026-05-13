import { Link, useNavigate } from "react-router-dom";
import { Plus, Download, LayoutGrid, Eye, AlertTriangle, Star, EyeOff } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { AdminFooter } from "../components/admin/layout/AdminFooter";
import { CategoryList } from "../components/admin/categories/category-manager/CategoryList";

const StatCard = ({ icon: Icon, title, value, badge, badgeColor, iconColor, iconBg }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      {badge && (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  </div>
);

function AdminCategories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <AdminHeader />

        <main className="flex-grow p-8 max-w-[1400px] mx-auto w-full flex flex-col">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                <span>›</span>
                <span className="text-blue-600">Categories</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Category Management</h1>
              <p className="text-sm text-gray-500">Organize and manage your product catalog hierarchy with precision.</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => navigate('/admin/categories/new')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          </div>

          {/* Stat Cards - 5 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Categories" value="24"
              badge="+12%" badgeColor="bg-emerald-50 text-emerald-600"
              icon={LayoutGrid} iconBg="bg-blue-50" iconColor="text-blue-600"
            />
            <StatCard
              title="Active" value="18"
              icon={Eye} iconBg="bg-emerald-50" iconColor="text-emerald-600"
            />
            <StatCard
              title="Empty" value="2"
              badge="Review" badgeColor="bg-rose-100 text-rose-700"
              icon={AlertTriangle} iconBg="bg-rose-50" iconColor="text-rose-600"
            />
            <StatCard
              title="Most Popular" value="Graphics C..."
              icon={Star} iconBg="bg-amber-50" iconColor="text-amber-500"
            />
            <StatCard
              title="Hidden" value="4"
              icon={EyeOff} iconBg="bg-gray-100" iconColor="text-gray-500"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 pb-12">
            <CategoryList />
          </div>

          <div className="mt-auto">
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminCategories;
