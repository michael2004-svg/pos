import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";

const OrderCard = ({ order }) => {
  return (
    <div className="w-full bg-[#262626] p-3 sm:p-4 rounded-lg">
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="bg-[#f6b100] p-2 sm:p-3 text-base sm:text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails?.name)}
        </button>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-none">
              {order.customerDetails?.name || "Guest"}
            </h1>
            <p className="text-[#ababab] text-xs">Table {order.table?.tableNo || "N/A"}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {order.orderStatus === "Ready" ? (
              <p className="text-green-500 bg-[#2e4a40] px-2 py-1 rounded-lg text-xs">
                {order.orderStatus}
              </p>
            ) : (
              <p className="text-yellow-500 bg-[#4a452e] px-2 py-1 rounded-lg text-xs">
                {order.orderStatus}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-[#ababab] text-xs">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items?.length || 0} Items</p>
      </div>
      <div className="flex items-center justify-between mt-3">
        <h1 className="text-[#f5f5f5] font-semibold">Total</h1>
        <p className="text-[#f5f5f5] font-semibold">₹{order.bills?.totalWithTax?.toFixed(2) || "0.00"}</p>
      </div>
    </div>
  );
};

export default OrderCard;
