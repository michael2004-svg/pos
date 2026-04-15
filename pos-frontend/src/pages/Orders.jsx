import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const allOrders = resData?.data?.data || [];
  
  const filteredOrders = status === "all" 
    ? allOrders 
    : status === "progress"
    ? allOrders.filter(o => o.orderStatus === "In Progress")
    : status === "ready"
    ? allOrders.filter(o => o.orderStatus === "Ready")
    : allOrders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-10 py-4 gap-2 flex-shrink-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl md:text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["all", "progress", "ready", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-xs sm:text-lg px-2 sm:px-5 py-2 rounded-lg font-semibold ${
                status === s ? "bg-[#383838] text-[#f5f5f5]" : "text-[#ababab]"
              }`}
            >
              {s === "all" ? "All" : s === "progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 md:px-10 py-4 overflow-y-auto flex-1">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <p className="col-span-full text-gray-500 text-center py-10">No orders found</p>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
