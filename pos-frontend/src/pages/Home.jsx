import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useSelector } from "react-redux";

const Home = () => {
  const { role } = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-2 md:gap-3 overflow-hidden pb-16 lg:pb-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Greetings />
        <div className="flex items-center w-full gap-2 md:gap-3 px-4 md:px-8 mt-4 md:mt-8">
          {role === "Admin" && (
            <>
              <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={512} footerNum={1.6} />
              <MiniCard title="In Progress" icon={<GrInProgress />} number={16} footerNum={3.6} />
            </>
          )}
        </div>
        <RecentOrders />
      </div>

      <div className="w-full lg:w-auto lg:flex-1 hidden lg:block">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
