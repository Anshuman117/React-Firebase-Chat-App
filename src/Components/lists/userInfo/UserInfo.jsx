import React from "react";
import avatar from "../../../assets/avatar.png";
import more from "../../../assets/more.png";
import video from "../../../assets/video.png";
import edit from "../../../assets/edit.png";
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="flex items-center justify-between border-b border-white/50 bg-[linear-gradient(90deg,rgba(79,157,255,0.18),rgba(255,255,255,0.7),rgba(255,213,92,0.18))] px-4 py-5">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={currentUser.avatar || avatar}
          alt=""
          className="h-11 w-11 rounded-full border border-white/90 object-cover shadow-[0_10px_22px_rgba(79,131,194,0.18)]"
        />
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-800">{currentUser.username}</h2>
          <p className="truncate text-xs chatbee-soft-text">Your ChatBee inbox</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_24px_rgba(92,126,176,0.12)] transition hover:-translate-y-0.5">
          <img src={more} alt="" className="h-4 w-4 opacity-80 transition hover:opacity-100" />
        </button>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_24px_rgba(92,126,176,0.12)] transition hover:-translate-y-0.5">
          <img src={video} alt="" className="h-4 w-4 opacity-80 transition hover:opacity-100" />
        </button>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_24px_rgba(92,126,176,0.12)] transition hover:-translate-y-0.5">
          <img src={edit} alt="" className="h-4 w-4 opacity-80 transition hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
