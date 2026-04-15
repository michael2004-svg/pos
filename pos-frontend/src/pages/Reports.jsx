import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders, getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import { FaArrowLeft, FaPrint, FaFilePdf, FaChartLine, FaMoneyBillWave, FaUsers, FaChair } from "react-icons/fa";
import BackButton from "../components/shared/BackButton";
import { MdTableBar } from "react-icons/md";

const Reports = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("today");

  useEffect(() => {
    if (role !== "Admin") {
      navigate("/");
    }
    document.title = "POS | Reports";
  }, [role]);

  const { data: ordersData } = useQuery({
    queryKey: ["orders-report"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  const { data: tablesData } = useQuery({
    queryKey: ["tables-report"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.data?.data || [];
  const tables = tablesData?.data?.data || [];

  const totalRevenue = orders.reduce((sum, order) => sum + (order.bills?.totalWithTax || 0), 0);
  const completedOrders = orders.filter(o => o.orderStatus === "Completed").length;
  const inProgressOrders = orders.filter(o => o.orderStatus === "In Progress").length;
  const readyOrders = orders.filter(o => o.orderStatus === "Ready").length;
  const totalTables = tables.length;
  const bookedTables = tables.filter(t => t.status === "Booked").length;
  const availableTables = tables.filter(t => t.status === "Available").length;

  const handlePrint = () => {
    window.print();
    enqueueSnackbar("Preparing report for printing...", { variant: "info" });
  };

  const handleExportPDF = () => {
    enqueueSnackbar("PDF export coming soon!", { variant: "info" });
  };

  if (role !== "Admin") {
    return null;
  }

  return (
    <div className="p-4 bg-[#1f1f1f] min-h-screen pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <h2 className="text-xl font-bold text-[#f5f5f5]">Reports & Analytics</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-[#262626] p-2 rounded-lg text-[#f5f5f5]"
          >
            <FaPrint size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-[#262626] p-2 rounded-lg text-[#f5f5f5]"
          >
            <FaFilePdf size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["today", "week", "month", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              dateRange === range
                ? "bg-yellow-500 text-black"
                : "bg-[#262626] text-[#ababab]"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#262626] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-green-500" />
            <p className="text-[#ababab] text-sm">Total Revenue</p>
          </div>
          <p className="text-[#f5f5f5] text-xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-[#262626] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaChartLine className="text-blue-500" />
            <p className="text-[#ababab] text-sm">Total Orders</p>
          </div>
          <p className="text-[#f5f5f5] text-xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-[#262626] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="text-yellow-500" />
            <p className="text-[#ababab] text-sm">Customers</p>
          </div>
          <p className="text-[#f5f5f5] text-xl font-bold">{completedOrders}</p>
        </div>

        <div className="bg-[#262626] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaChair className="text-purple-500" />
            <p className="text-[#ababab] text-sm">Tables</p>
          </div>
          <p className="text-[#f5f5f5] text-xl font-bold">{availableTables}/{totalTables}</p>
        </div>
      </div>

      <div className="bg-[#262626] p-4 rounded-lg mb-6">
        <h3 className="text-[#f5f5f5] font-semibold mb-4">Order Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[#ababab] text-sm">In Progress</p>
            <p className="text-[#f5f5f5] text-2xl font-bold text-yellow-500">{inProgressOrders}</p>
          </div>
          <div className="text-center">
            <p className="text-[#ababab] text-sm">Ready</p>
            <p className="text-[#f5f5f5] text-2xl font-bold text-blue-500">{readyOrders}</p>
          </div>
          <div className="text-center">
            <p className="text-[#ababab] text-sm">Completed</p>
            <p className="text-[#f5f5f5] text-2xl font-bold text-green-500">{completedOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#262626] p-4 rounded-lg mb-6">
        <h3 className="text-[#f5f5f5] font-semibold mb-4">Tables Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-lg">
            <span className="text-[#ababab]">Available</span>
            <span className="text-green-500 font-bold">{availableTables}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-lg">
            <span className="text-[#ababab]">Booked</span>
            <span className="text-red-500 font-bold">{bookedTables}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#262626] p-4 rounded-lg">
        <h3 className="text-[#f5f5f5] font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {orders.slice(0, 10).map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-lg"
            >
              <div>
                <p className="text-[#f5f5f5] font-medium">{order.customerDetails?.name || "Guest"}</p>
                <p className="text-[#ababab] text-xs">
                  {new Date(order.createdAt).toLocaleDateString()} | Table {order.table}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#f5f5f5] font-bold">₹{order.bills?.totalWithTax?.toFixed(2) || "0.00"}</p>
                <p className={`text-xs ${order.orderStatus === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                  {order.orderStatus}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-[#ababab] text-center py-4">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;