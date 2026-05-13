import { Link } from "react-router-dom";
import { Upload, Plus, FileText, Banknote, TrendingDown, Clock } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { OrderStatCard } from "../components/admin/orders/OrderStatCard";
import { OrdersTable } from "../components/admin/orders/OrdersTable";

function AdminOrders() {
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
                <span className="text-blue-600">Orders</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Export CSV
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                <Plus className="w-4 h-4" /> Create Order
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <OrderStatCard 
              title="Total Orders" 
              value="2,543" 
              trend="+12.5%" 
              icon={FileText} 
              isNegative={false} 
            />
            <OrderStatCard 
              title="Net Revenue" 
              value="$124,592.00" 
              trend="+8.2%" 
              icon={Banknote} 
              isNegative={false} 
            />
            <OrderStatCard 
              title="Average Order Value" 
              value="$48.90" 
              trend="-2.1%" 
              icon={TrendingDown} 
              isNegative={true} 
            />
            <OrderStatCard 
              title="Pending Fulfillment" 
              value="18" 
              icon={Clock} 
              badge="Urgent" 
            />
          </div>

          {/* Main Table */}
          <div className="flex-1 pb-12">
            <OrdersTable />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;
