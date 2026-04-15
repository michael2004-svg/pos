import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import BackButton from "../components/shared/BackButton";

const Settings = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Tables Management", path: "/tables", icon: "🪑" },
    { label: "Orders History", path: "/orders", icon: "📋" },
    { label: "Menu Management", path: "/menu-settings", icon: "🍽️" },
    { label: "Reports & Analytics", path: "/reports", icon: "📊" },
  ];

  const adminItems = userData.role === "Admin" ? [
    { label: "Add Table", path: "/dashboard", icon: "➕" },
    { label: "View All Reports", path: "/reports", icon: "📈" },
  ] : [];

  return (
    <div className="p-4 bg-[#1f1f1f] min-h-screen pb-20">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h2 className="text-xl font-bold text-[#f5f5f5]">Settings</h2>
      </div>
      
      <div className="bg-[#262626] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold text-black">
            {userData.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-[#f5f5f5] font-semibold text-lg">{userData.name}</p>
            <p className="text-[#ababab] text-sm">{userData.role}</p>
            <p className="text-[#ababab] text-xs">{userData.email}</p>
          </div>
        </div>
      </div>

      <h3 className="text-[#ababab] text-sm font-semibold mb-3 uppercase">Quick Actions</h3>
      <div className="space-y-2 mb-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-[#262626] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a]"
          >
            <span className="text-[#f5f5f5] text-lg">{item.icon} {item.label}</span>
            <span className="text-[#ababab] text-xl">›</span>
          </div>
        ))}
      </div>

      {userData.role === "Admin" && (
        <>
          <h3 className="text-[#ababab] text-sm font-semibold mb-3 uppercase">Admin Panel</h3>
          <div className="space-y-2">
            {adminItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-[#262626] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a]"
              >
                <span className="text-[#f5f5f5] text-lg">{item.icon} {item.label}</span>
                <span className="text-[#ababab] text-xl">›</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;