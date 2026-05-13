import { DollarSign, ShoppingCart, Users, Activity, Download, Plus } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { StatCard } from "../components/admin/dashboard/StatCard";
import { RevenueAnalysis } from "../components/admin/dashboard/RevenueAnalysis";
import { TopSelling } from "../components/admin/dashboard/TopSelling";
import { RecentOrders } from "../components/admin/dashboard/RecentOrders";
import { AdminFooter } from "../components/admin/layout/AdminFooter";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Overview</h1>
              <p className="text-sm text-gray-500">Welcome back, here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" /> New Product
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Total Revenue" 
              value="$1,284,430" 
              trend="12.5%" 
              trendType="up"
              color="blue"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard 
              title="Total Orders" 
              value="14,210" 
              trend="8.2%" 
              trendType="up"
              color="indigo"
              icon={<ShoppingCart className="w-5 h-5" />}
            />
            <StatCard 
              title="New Customers" 
              value="3,842" 
              trend="24.1%" 
              trendType="up"
              color="amber"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard 
              title="Conversion Rate" 
              value="4.2%" 
              trend="1.4%" 
              trendType="down"
              color="rose"
              icon={<Activity className="w-5 h-5" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <RevenueAnalysis />
            </div>
            <div className="lg:col-span-1">
              <TopSelling />
            </div>
          </div>

          {/* Recent Orders Row */}
          <div>
            <RecentOrders />
          </div>

          <AdminFooter />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
