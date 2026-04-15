import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import { MdTableBar } from "react-icons/md";

const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const tables = resData?.data?.data || [];
  const filteredTables = status === "all" 
    ? tables 
    : tables.filter(t => t.status.toLowerCase() === status.toLowerCase());

  const availableCount = tables.filter(t => t.status === "Available").length;
  const bookedCount = tables.filter(t => t.status === "Booked").length;

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-10 py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl md:text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-sm md:text-lg px-3 md:px-5 py-2 rounded-lg font-semibold ${
              status === "all" ? "bg-[#383838] text-[#f5f5f5]" : ""
            }`}
          >
            All ({tables.length})
          </button>
          <button
            onClick={() => setStatus("available")}
            className={`text-sm md:text-lg px-3 md:px-5 py-2 rounded-lg font-semibold ${
              status === "available" ? "bg-green-600 text-white" : "text-[#ababab]"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-sm md:text-lg px-3 md:px-5 py-2 rounded-lg font-semibold ${
              status === "booked" ? "bg-red-600 text-white" : "text-[#ababab]"
            }`}
          >
            Booked ({bookedCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 px-2 md:px-10 py-2 md:py-4 flex-1 overflow-y-auto">
        {filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#ababab]">
            <MdTableBar size={48} className="mb-4" />
            <p className="text-lg">
              {status === "booked" ? "No booked tables" : "No available tables"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
