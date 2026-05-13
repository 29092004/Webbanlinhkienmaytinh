import { Link } from "react-router-dom";
import { Printer, CornerUpLeft, CheckCircle } from "lucide-react";
import { AdminSidebar } from "../components/admin/layout/AdminSidebar";
import { AdminHeader } from "../components/admin/layout/AdminHeader";
import { AdminFooter } from "../components/admin/layout/AdminFooter";
import { OrderItemsList } from "../components/admin/orders/order-detail/OrderItemsList";
import { InternalStaffNotes } from "../components/admin/orders/order-detail/InternalStaffNotes";
import { CustomerDetailsCard } from "../components/admin/orders/order-detail/CustomerDetailsCard";
import { AddressDetailsCard } from "../components/admin/orders/order-detail/AddressDetailsCard";
import { TransactionDetailsCard } from "../components/admin/orders/order-detail/TransactionDetailsCard";
import { OrderTimelineCard } from "../components/admin/orders/order-detail/OrderTimelineCard";

function AdminOrderDetail() {
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
                <Link to="/admin/orders" className="hover:text-gray-900 transition-colors">Orders</Link>
                <span>›</span>
                <span className="text-gray-900">#EXO-1092</span>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order #EXO-1092</h1>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Unfulfilled</span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Paid</span>
                </div>
              </div>

              <p className="text-sm text-gray-500">Placed on Oct 24, 2024 at 2:45 PM from Storefront</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <CornerUpLeft className="w-4 h-4" /> Refund
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-blue-200">
                <CheckCircle className="w-4 h-4" /> Mark as Fulfilled
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <OrderItemsList />
              <InternalStaffNotes />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <CustomerDetailsCard />
              <AddressDetailsCard />
              <TransactionDetailsCard />
              <OrderTimelineCard />
            </div>
          </div>

          <div className="mt-12">
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
