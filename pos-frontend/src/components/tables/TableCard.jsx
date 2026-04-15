import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBookedMsg, setShowBookedMsg] = useState(false);

  const handleClick = (tableName) => {
    if (status === "Booked") {
      setShowBookedMsg(true);
      enqueueSnackbar(`Table ${tableName} is already booked!`, { variant: "warning" });
      setTimeout(() => setShowBookedMsg(false), 2000);
      return;
    }
    const table = { tableId: id, tableNo: tableName };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  return (
    <div
      onClick={() => handleClick(name)}
      className={`w-full min-w-[120px] sm:min-w-[150px] bg-[#262626] p-3 sm:p-4 rounded-lg transition-transform hover:scale-105 ${
        status === "Booked" ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:bg-[#2c2c2c]"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[#f5f5f5] text-sm sm:text-xl font-semibold">
          Table {name}
        </h1>
        <p className={`text-xs px-2 py-1 rounded-lg ${status === "Booked" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {status}
        </p>
      </div>
      <div className="flex items-center justify-center my-2 sm:my-3">
        <span
          className="text-white rounded-full p-3 sm:p-5 text-sm sm:text-xl"
          style={{ backgroundColor: status === "Booked" ? "#4a1a1a" : (initials ? getBgColor() : "#1f1f1f") }}
        >
          {status === "Booked" ? "🔒" : (getAvatarName(initials) || "A")}
        </span>
      </div>
      <p className="text-[#ababab] text-xs">
        Seats: <span className="text-[#f5f5f5]">{seats}</span>
      </p>
      {status === "Booked" && initials && (
        <p className="text-[#ababab] text-xs mt-1 truncate">
          {initials}
        </p>
      )}
    </div>
  );
};

export default TableCard;
