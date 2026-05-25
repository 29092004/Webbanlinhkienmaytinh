import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "../../components/admin/layout/AdminSidebar";
import { InventoryStatus } from "../../components/admin/dashboard/InventoryStatus";
import { RecentOrders } from "../../components/admin/dashboard/RecentOrders";
import { RevenueAnalysis } from "../../components/admin/dashboard/RevenueAnalysis";
import { StatCard } from "../../components/admin/dashboard/StatCard";
import { api } from "../../lib/api";
import {
  buildDashboardMetrics,
  clampDashboardRange,
  getDefaultDashboardRange,
} from "../../lib/adminDashboard";

function AdminDashboard() {
  const defaultRange = useMemo(() => getDefaultDashboardRange(), []);
  const [dateRange, setDateRange] = useState(defaultRange);
  const [rangeNotice, setRangeNotice] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
          api.get("/customers"),
        ]);

        setOrders(ordersResponse.data?.data ?? []);
        setProducts(productsResponse.data?.data ?? []);
        setCustomers(customersResponse.data?.data ?? []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không tải được dữ liệu dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const metrics = useMemo(
    () =>
      buildDashboardMetrics({
        orders,
        products,
        customers,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    [customers, dateRange.endDate, dateRange.startDate, orders, products],
  );

  const handleDateChange = (field, value) => {
    const nextRange = clampDashboardRange(
      field === "startDate" ? value : dateRange.startDate,
      field === "endDate" ? value : dateRange.endDate,
    );

    setDateRange(nextRange);

    const wasAdjusted =
      (field === "startDate" && value !== nextRange.startDate) ||
      (field === "endDate" && value !== nextRange.endDate);

    setRangeNotice(
      wasAdjusted ? "Khoảng thời gian đã được giới hạn trong 1 tháng gần nhất." : "",
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex">
      <AdminSidebar />

      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full max-w-[1600px] flex-grow p-8">
          {error ? (
            <div className="mb-8 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={metrics.stats.revenue.title}
              value={isLoading ? "..." : metrics.stats.revenue.value}
              trend={metrics.stats.revenue.trend.value}
              trendType={metrics.stats.revenue.trend.type}
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              title={metrics.stats.orders.title}
              value={isLoading ? "..." : metrics.stats.orders.value}
              trend={metrics.stats.orders.trend.value}
              trendType={metrics.stats.orders.trend.type}
              icon={<ShoppingCart className="w-5 h-5" />}
            />
            <StatCard
              title={metrics.stats.products.title}
              value={isLoading ? "..." : metrics.stats.products.value}
              trend={metrics.stats.products.trend.value}
              trendType={metrics.stats.products.trend.type}
              icon={<Package className="w-5 h-5" />}
            />
            <StatCard
              title={metrics.stats.customers.title}
              value={isLoading ? "..." : metrics.stats.customers.value}
              trend={metrics.stats.customers.trend.value}
              trendType={metrics.stats.customers.trend.type}
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueAnalysis
                data={metrics.revenueSeries}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={handleDateChange}
                maxRangeNotice={rangeNotice}
                minDate={defaultRange.startDate}
                maxDate={defaultRange.endDate}
              />
            </div>
            <div className="flex flex-col gap-8 lg:col-span-1">
              <InventoryStatus inventoryData={metrics.inventoryItems} />
            </div>
          </div>

          <div className="mb-8">
            <RecentOrders orders={metrics.recentOrders} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
