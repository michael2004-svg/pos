import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable, getTables } from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ setIsTableModalOpen, action = "table" }) => {
  const [activeTab, setActiveTab] = useState(action);
  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });
  const [categoryData, setCategoryData] = useState({ name: "", icon: "🍽️", color: "#b73e3e" });
  const [dishData, setDishData] = useState({ name: "", price: "", category: "Vegetarian" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "table") {
      setTableData((prev) => ({ ...prev, [name]: value }));
    } else if (activeTab === "category") {
      setCategoryData((prev) => ({ ...prev, [name]: value }));
    } else if (activeTab === "dishes") {
      setDishData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "table") {
      tableMutation.mutate(tableData);
    } else if (activeTab === "category") {
      enqueueSnackbar("Category feature coming soon!", { variant: "info" });
    } else if (activeTab === "dishes") {
      enqueueSnackbar("Dishes feature coming soon!", { variant: "info" });
    }
  };

  const handleCloseModal = () => {
    setIsTableModalOpen(false);
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setIsTableModalOpen(false);
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: "error" });
    }
  });

  useEffect(() => {
    setActiveTab(action);
  }, [action]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">
            {activeTab === "table" && "Add Table"}
            {activeTab === "category" && "Add Category"}
            {activeTab === "dishes" && "Add Dishes"}
          </h2>
          <button onClick={handleCloseModal} className="text-[#f5f5f5] hover:text-red-500">
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("table")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === "table" ? "bg-yellow-500 text-black" : "bg-[#1f1f1f] text-white"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === "category" ? "bg-yellow-500 text-black" : "bg-[#1f1f1f] text-white"
            }`}
          >
            Category
          </button>
          <button
            onClick={() => setActiveTab("dishes")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === "dishes" ? "bg-yellow-500 text-black" : "bg-[#1f1f1f] text-white"
            }`}
          >
            Dishes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "table" && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Table Number</label>
                <input
                  type="number"
                  name="tableNo"
                  value={tableData.tableNo}
                  onChange={handleInputChange}
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Number of Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={tableData.seats}
                  onChange={handleInputChange}
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "category" && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={categoryData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Course"
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={categoryData.icon}
                  onChange={handleInputChange}
                  placeholder="🍛"
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Color</label>
                <input
                  type="color"
                  name="color"
                  value={categoryData.color}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-[#1f1f1f] rounded-lg cursor-pointer"
                />
              </div>
            </>
          )}

          {activeTab === "dishes" && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Dish Name</label>
                <input
                  type="text"
                  name="name"
                  value={dishData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Butter Chicken"
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={dishData.price}
                  onChange={handleInputChange}
                  placeholder="250"
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={dishData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg focus:outline-none"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
          >
            {activeTab === "table" && "Add Table"}
            {activeTab === "category" && "Add Category"}
            {activeTab === "dishes" && "Add Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;