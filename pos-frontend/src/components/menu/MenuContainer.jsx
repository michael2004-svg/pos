import React, { useState } from "react";
import { menus } from "../../constants";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";


const MenuContainer = () => {
  const [selected, setSelected] = useState(menus[0]);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const dispatch = useDispatch();

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if(itemCount === 0) return;

    const {name, price} = item;
    const newObj = { id: new Date(), name, pricePerQuantity: price, quantity: itemCount, price: price * itemCount };

    dispatch(addItems(newObj));
    setItemCount(0);
  }


  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-4 md:px-10 py-4 w-full">
        {menus.map((menu) => {
          return (
            <div
              key={menu.id}
              className="flex flex-col items-start justify-between p-3 md:p-4 rounded-lg min-h-[80px] md:min-h-[100px] cursor-pointer"
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-sm md:text-lg font-semibold truncate">
                  {menu.icon} {menu.name}
                </h1>
                {selected.id === menu.id && (
                  <GrRadialSelected className="text-white flex-shrink-0" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-xs md:text-sm font-semibold">
                {menu.items.length} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-2 md:mt-4" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-4 md:px-10 py-4 w-full">
        {selected?.items.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col items-start justify-between p-3 md:p-4 rounded-lg min-h-[120px] md:min-h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
            >
              <div className="flex items-start justify-between w-full">
                <h1 className="text-[#f5f5f5] text-sm md:text-lg font-semibold truncate">
                  {item.name}
                </h1>
                <button onClick={() => handleAddToCart(item)} className="bg-[#2e4a40] text-[#02ca3a] p-1 md:p-2 rounded-lg">
                  <FaShoppingCart size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                <p className="text-[#f5f5f5] text-base md:text-xl font-bold">
                  ₹{item.price}
                </p>
                <div className="flex items-center justify-between bg-[#1f1f1f] px-2 md:px-4 py-1 md:py-3 rounded-lg gap-2 md:gap-6 w-[60%]">
                  <button onClick={() => decrement(item.id)} className="text-yellow-500 text-lg md:text-2xl">
                    &minus;
                  </button>
                  <span className="text-white text-sm">{itemId == item.id ? itemCount : "0"}</span>
                  <button onClick={() => increment(item.id)} className="text-yellow-500 text-lg md:text-2xl">
                    &#43;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MenuContainer;
