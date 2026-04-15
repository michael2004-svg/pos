import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-2 md:gap-3 overflow-hidden pb-16 md:pb-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-10 py-2 md:py-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl md:text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <MdRestaurantMenu className="text-[#f5f5f5] text-2xl md:text-4xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-sm md:text-md text-[#f5f5f5] font-semibold">
                {customerData.customerName || "Customer"}
              </h1>
              <p className="text-xs text-[#ababab]">
                Table: {customerData.table?.tableNo || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>

      <div className="w-full md:w-80 lg:w-96 bg-[#1a1a1a] rounded-lg p-2 flex-shrink-0 overflow-y-auto max-h-[40%] md:max-h-none md:mt-4 md:mr-3">
        <CustomerInfo />
        <hr className="border-[#2a2a2a] border-t-2 my-2" />
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2 my-2" />
        <Bill />
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
