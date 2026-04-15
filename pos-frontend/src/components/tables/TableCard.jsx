import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (tableName) => {
    if (status === "Booked") {
      enqueueSnackbar(`Table ${tableName} is already booked!`, { variant: "warning" });
      return;
    }
    const table = { tableId: id, tableNo: tableName };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  return (
    <div
      onClick={() => handleClick(name)}
      className={`w-full bg-[#262626] p-2 sm:p-3 rounded-lg transition-transform hover:scale-105 cursor-pointer ${
        status === "Booked" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[#f5f5f5] text-sm font-semibold">
          T{name}
        </h1>
        <p className={`text-[10px] px-1.5 py-0.5 rounded ${status === "Booked" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {status === "Booked" ? "Booked" : "Free"}
        </p>
      </div>
      <div className="flex items-center justify-center my-1 sm:my-2">
        <span
          className="text-white rounded-full p-2 sm:p-3 text-xs sm:text-base"
          style={{ backgroundColor: status === "Booked" ? "#4a1a1a" : "#1f1f1f" }}
        >
          {status === "Booked" ? "🔒" : "A"}
        </span>
      </div>
      <p className="text-[#ababab] text-[10px] text-center">
        {seats} seats
      </p>
    </div>
  );
};

export default TableCard;
