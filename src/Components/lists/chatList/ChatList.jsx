import React, { useState } from "react";
import search from "../../../assets/search.png";
import plus from "../../../assets/plus.png";
import minus from "../../../assets/minus.png";
import avatar from "../../../assets/avatar.png";

const ChatList = () => {
  const [addMode, setaddMode] = useState(false);
  return (
    <div className="flex-1 overflow-scroll">
      <div className="flex items-center gap-[30px] p-[20px]">
        <div
          className="flex bg-[rgba(17,25,40,0.5)] rounded-full
  "
        >
          <img src={search} alt="" className="w-[20px] h-[20px] p-0.5" />
          <input
            type="text"
            placeholder="Search"
            className="
    bg-transparent
    border-none
    outline-none
    focus:outline-none
    focus:ring-0
    text-white
    placeholder-gray-400
  "
          />
        </div>
        <img
          src={addMode ? minus : plus}
          alt=""
          className="w-[20px] h-[20px] bg-[rgba(17,25,40,0.5)] rounded-xl p-0 hover  cursor-pointer"
          onClick={() => setaddMode((prev) => !prev)}
        />
      </div>

      <div className="">
        <div className="flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35] ">
          <img
            src={avatar}
            alt=""
            className="w-[50px] h-[50px]  object-cover rounded-full "
          />
          <div className="flex flex-col gap-[10px]">
            <span className="font-medium">anshu</span>
            <p className="font-[14px] font-light">hello</p>
          </div>
        </div>
        <div className="flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35] gap-[20px]">
          <img
            src={avatar}
            alt=""
            className="w-[50px] h-[50px]  object-cover rounded-full "
          />
          <div>
            <span className="font-medium">anshu</span>
            <p className="font-[14px] font-light">hello</p>
          </div>
        </div>
        <div className="flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35] gap-[20px]">
          <img
            src={avatar}
            alt=""
            className="w-[50px] h-[50px]  object-cover rounded-full "
          />
          <div>
            <span className="font-medium">anshu</span>
            <p className="font-[14px] font-light">hello</p>
          </div>
        </div>
        <div className="flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35] gap-[20px]">
          <img
            src={avatar}
            alt=""
            className="w-[50px] h-[50px]  object-cover rounded-full "
          />
          <div>
            <span className="font-medium">anshu</span>
            <p className="font-[14px] font-light">hello</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
