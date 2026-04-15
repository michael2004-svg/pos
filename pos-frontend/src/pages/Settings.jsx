import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Tables Management", path: "/tables", icon: "🪑" },
    { label: "Orders History", path: "/orders", icon: "📋" },
    { label: "Menu Management", path: "/menu-settings", icon: "🍽️" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#f5f5f5] mb-6">Settings</h2>
      
      <div className="bg-[#1f1f1f] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold text-black">
            {userData.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-[#f5f5f5] font-semibold">{userData.name}</p>
            <p className="text-[#ababab] text-sm">{userData.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-[#1f1f1f] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a]"
          >
            <span className="text-[#f5f5f5] text-lg">{item.icon} {item.label}</span>
            <span className="text-[#ababab]">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;