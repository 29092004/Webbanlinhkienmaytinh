import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { AdminSidebar } from "../../components/admin/layout/AdminSidebar";
import { StatCard } from "../../components/admin/dashboard/StatCard";
import { RevenueAnalysis } from "../../components/admin/dashboard/RevenueAnalysis";
import { InventoryStatus } from "../../components/admin/dashboard/InventoryStatus";
import { WorkReminder } from "../../components/admin/dashboard/WorkReminder";
import { RecentOrders } from "../../components/admin/dashboard/RecentOrders";
import { PromotionBanner } from "../../components/admin/dashboard/PromotionBanner";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-80 flex flex-col min-h-screen relative">
        <main className="flex-grow p-8 w-full max-w-[1600px]">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng doanh thu"
              value="1.280.000.000đ"
              trend="12.5%"
              trendType="up"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              title="Tổng đơn hàng"
              value="452"
              trend="8.2%"
              trendType="up"
              icon={<ShoppingCart className="w-5 h-5" />}
            />
            <StatCard
              title="Tổng sản phẩm"
              value="1,840"
              trend="0.0%"
              trendType="up"
              icon={<Package className="w-5 h-5" />}
            />
            <StatCard
              title="Người dùng mới"
              value="89"
              trend="2.1%"
              trendType="down"
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          {/* Charts & Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <RevenueAnalysis />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-8">
              <InventoryStatus />
              <WorkReminder />
            </div>
          </div>

          {/* Recent Orders Row */}
          <div className="mb-8">
            <RecentOrders />
          </div>

          {/* Promotion Banner */}
          <div className="mb-12">
            <PromotionBanner />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
