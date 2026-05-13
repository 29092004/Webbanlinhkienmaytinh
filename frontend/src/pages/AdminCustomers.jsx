import { Link } from "react-router-dom";
import { Download, UserPlus, Users, Zap, Banknote, Award, RefreshCw } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { AdminFooter } from "../components/admin/layout/AdminFooter";
import { CustomerStatCard } from "../components/admin/customers/CustomerStatCard";
import { CustomersTable } from "../components/admin/customers/CustomersTable";

function AdminCustomers() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <AdminHeader />
        
        <main className="flex-grow p-8 max-w-[1600px] mx-auto w-full flex flex-col">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Link to="/admin" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                <span>›</span>
                <span className="text-blue-600">Customers</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Customer Management</h1>
              <p className="text-sm text-gray-500">Manage and monitor your global performance PC clientele database.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                <UserPlus className="w-4 h-4" /> Add New User
              </button>
            </div>
          </div>

          {/* Stat Cards - 5 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <CustomerStatCard 
              title="Total Customers" 
              value="1,284" 
              trend="~ 12%" 
              icon={Users} 
              isNegative={false}
              iconColorClass="bg-blue-50 text-blue-600"
              trendColorClass="bg-emerald-100/50" 
            />
            <CustomerStatCard 
              title="Active Users" 
              value="942" 
              trend="~ 5%" 
              icon={Zap} 
              isNegative={false} 
              iconColorClass="bg-cyan-50 text-cyan-500"
              trendColorClass="bg-emerald-100/50" 
            />
            <CustomerStatCard 
              title="Avg. Order Value" 
              value="$3,420" 
              trend="~ 18%" 
              icon={Banknote} 
              isNegative={false} 
              iconColorClass="bg-amber-50 text-amber-500"
              trendColorClass="bg-emerald-100/50" 
            />
            <CustomerStatCard 
              title="VIP Customers" 
              value="42" 
              trend="+4" 
              icon={Award} 
              isNegative={false} 
              iconColorClass="bg-purple-50 text-purple-600"
              trendColorClass="bg-purple-100" 
            />
            <CustomerStatCard 
              title="Returning Rate" 
              value="24.5%" 
              trend="~ 2%" 
              icon={RefreshCw} 
              isNegative={true} 
              iconColorClass="bg-emerald-50 text-emerald-500"
              trendColorClass="bg-rose-100/50" 
            />
          </div>

          {/* Main Table */}
          <div className="flex-1 pb-12">
            <CustomersTable />
          </div>
          
          <div className="mt-auto">
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminCustomers;
