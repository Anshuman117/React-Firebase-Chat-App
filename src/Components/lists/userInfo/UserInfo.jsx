import React from "react";
import avatar from "../../../assets/avatar.png";
import more from "../../../assets/more.png";
import video from "../../../assets/video.png";
import edit from "../../../assets/edit.png";

const userInfo = () => {
  return (
    <div className="flex 0-2 items-center gap-8 p-5">
      <div className="flex items-center gap-2">
        <img src={avatar} alt="" className="w-[50px] h-[50px] rounded-full object-cover  " />
        <h2 className="">anshuman</h2>
      </div>
      
      <div className="flex gap-3 w-[20px] h-[20px]  ">
        <img src={more} alt="" className="cursor-pointer"/>
        <img src={video} alt="" className="cursor-pointer" />
        <img src={edit} alt="" className="cursor-pointer" />
      </div>
    </div>
  );
};

export default userInfo;
