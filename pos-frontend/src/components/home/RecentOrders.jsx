import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

const RecentOrders = () => {
  const navigate = useNavigate();
  
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

  return (
    <div className="px-4 md:px-8 mt-4 md:mt-6">
      <div className="bg-[#1a1a1a] w-full h-[300px] md:h-[350px] rounded-lg">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-[#f5f5f5] text-lg font-semibold">
            Recent Orders
          </h1>
          <button 
            onClick={() => navigate("/orders")} 
            className="text-[#025cca] text-sm font-semibold"
          >
            View all
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-4 py-2 mx-4">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-transparent outline-none text-[#f5f5f5] w-full"
          />
        </div>

        <div className="mt-2 px-4 overflow-y-auto h-[180px]">
          {resData?.data?.data?.length > 0 ? (
            resData.data.data.slice(0, 5).map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
