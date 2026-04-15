import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { menus } from "../constants";

const MenuSettings = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(menus[0]);
  const [items, setItems] = useState([...menus]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Vegetarian" });

  React.useEffect(() => {
    if (role !== "Admin") {
      navigate("/");
    }
  }, [role]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const updated = items.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: [...cat.items, { id: Date.now(), name: newItem.name, price: parseInt(newItem.price), category: newItem.category }]
        };
      }
      return cat;
    });
    setItems(updated);
    setNewItem({ name: "", price: "", category: "Vegetarian" });
    setIsAdding(false);
  };

  const handleDeleteItem = (itemId) => {
    const updated = items.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    });
    setItems(updated);
  };

  return (
    <div className="p-4 bg-[#1f1f1f] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#f5f5f5]">Menu Management</h2>
        <button onClick={() => navigate("/settings")} className="text-[#ababab]">← Back</button>
      </div>

      <div className="mb-4">
        <h3 className="text-[#ababab] mb-2">Select Category</h3>
        <div className="flex gap-2 overflow-x-auto">
          {items.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setSelectedCategory(menu)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory.id === menu.id ? "bg-yellow-500 text-black" : "bg-[#2a2a2a] text-[#f5f5f5]"
              }`}
            >
              {menu.icon} {menu.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#f5f5f5]">{selectedCategory.name} Items</h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            {isAdding ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-[#262626] p-4 rounded-lg mb-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full bg-[#1f1f1f] text-white p-3 rounded-lg mb-2"
            />
            <button onClick={handleAddItem} className="bg-green-500 text-white px-4 py-2 rounded-lg w-full">
              Save Item
            </button>
          </div>
        )}

        <div className="space-y-2">
          {selectedCategory.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-[#262626] p-3 rounded-lg">
              <div>
                <p className="text-[#f5f5f5] font-semibold">{item.name}</p>
                <p className="text-[#ababab] text-sm">₹{item.price} - {item.category}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSettings;