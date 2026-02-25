import React from "react";
import avatar from "../../../assets/avatar.png";
import more from "../../../assets/more.png";
import video from "../../../assets/video.png";
import edit from "../../../assets/edit.png";
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="flex items-center justify-between border-b border-white/15 px-4 py-5">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={currentUser.avatar || avatar}
          alt=""
          className="h-11 w-11 rounded-full border border-white/20 object-cover"
        />
        <h2 className="truncate text-base font-semibold text-slate-50">{currentUser.username}</h2>
      </div>

      <div className="flex items-center gap-2">
        <img src={more} alt="" className="h-4 w-4 cursor-pointer opacity-80 transition hover:opacity-100" />
        <img src={video} alt="" className="h-4 w-4 cursor-pointer opacity-80 transition hover:opacity-100" />
        <img src={edit} alt="" className="h-4 w-4 cursor-pointer opacity-80 transition hover:opacity-100" />
      </div>
    </div>
  );
};

export default UserInfo;
