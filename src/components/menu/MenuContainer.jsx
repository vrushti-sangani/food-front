import React, { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { menus } from "../../constants";
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
    const newObj = { id: new Date(), name, pricePerQuantity: price, quantity: itemCount, price: price * itemCount}

    dispatch(addItems(newObj));
    setItemCount(0);
  }

  return (
    <>
      {/* Category Menu */}
      <div className="grid grid-cols-4 gap-4 px-10 w-full">
        {menus.map((menu) => {
          return (
            <div
              key={menu.id}
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
              }}
              className="flex flex-col items-center justify-between p-4 rounded-lg h-[100px] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {menu.icon} {menu.name}
                </h1>
                {selected.id === menu.id && (
                  <GrRadialSelected className="text-white size={20}" />
                )}
              </div>
              {/* <p className="text-[#ababab] text-sm font-semibold">
                {menu.items?.length || 0} items
              </p> */}
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Item List */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-full">
        {selected?.items?.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[107px] cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a]"
            >
              <div className="flex items-start justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {item.name}
                </h1>
                <button onClick={() => handleAddToCart(item)} className="bg-[#2e4a40] text-[#02ca3a] p-1 rounded-lg">
                  <FaShoppingCart size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 w-full">
                <p className="text-[#f5f5f5] text-xl font-bold">₹{item.price}</p>
                <div className="flex gap-4 items-center justify-between bg-[#1f1f1f] px-4 py-1 rounded-lg">
                  <button
                    onClick={() => decrement(item.id)}
                    className="text-yellow-500 text-2xl"
                  >
                    &minus;
                  </button>
                  <span className="text-white">
                    {item.id === itemId ? itemCount : "0"}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    className="text-yellow-500 text-2xl"
                  >
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
