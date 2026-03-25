import React from "react";
import avatar from "../../assets/avatar.png";
import arrowUp from "../../assets/arrowUp.png";
import arrowDown from "../../assets/arrowDown.png";
import download from "../../assets/download.png";
import { auth, db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const {
    chatsId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
  } = usechatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
  
    const currentUserRef = doc(db, "users", currentUser.id);
    const receiverRef = doc(db, "users", user.id);
  
    try {
      if (isReceiverBlocked) {
        // UNBLOCK
        await updateDoc(currentUserRef, {
          blocked: arrayRemove(user.id),
        });
  
        await updateDoc(receiverRef, {
          blocked: arrayRemove(currentUser.id),
        });
      } else {
        // BLOCK
        await updateDoc(currentUserRef, {
          blocked: arrayUnion(user.id),
        });
  
        await updateDoc(receiverRef, {
          blocked: arrayUnion(currentUser.id),
        });
      }
      changeBlock();
  
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="details h-full overflow-y-auto bg-[linear-gradient(180deg,rgba(255,248,219,0.65),rgba(255,255,255,0.62))]">
      <div className="user flex flex-col items-center gap-3 border-b border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,240,193,0.42))] px-5 py-7">
        <img
          src={user?.avatar || avatar}
          alt=""
          className="h-[92px] w-[92px] rounded-full border border-white/90 object-cover shadow-[0_18px_34px_rgba(98,133,181,0.16)]"
        />
        <h2 className="text-lg font-semibold text-slate-800">{user?.username}</h2>
        <p className="text-center text-xs chatbee-soft-text">Manage this conversation and privacy settings.</p>
      </div>
      <div className="info flex flex-col gap-4 p-5">
        <div className="chatbee-panel options rounded-[24px] p-4">
          <div className="title flex items-center justify-between">
            <span className="font-semibold text-slate-800">Chat Settings</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-[#0B2A5B] bg-[#0B2A5B] p-[8px]"
            />
          </div>
        </div>
        <div className="chatbee-panel options rounded-[24px] p-4">
          <div className="title flex items-center justify-between">
            <span className="font-semibold text-slate-800">Notifications</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-[#0B2A5B] bg-[#0B2A5B] p-[8px]"
            />
          </div>
        </div>
        <div className="chatbee-panel options rounded-[24px] p-4">
          <div className="title flex items-center justify-between">
            <span className="font-semibold text-slate-800">Privacy & Help</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-[#0B2A5B] bg-[#0B2A5B] p-[8px]"
            />
          </div>
        </div>
        <div className="chatbee-panel options rounded-[24px] p-4">
          <div className="title flex items-center justify-between">
            <span className="font-semibold text-slate-800">Shared Photos</span>
            <img
              src={arrowDown}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-white/80 bg-white/80 p-[8px]"
            />
          </div>

          <div className="photo mt-4 flex flex-col gap-3">
            <div className="photoItem flex items-center justify-between rounded-2xl bg-white/72 px-3 py-2 shadow-[0_10px_22px_rgba(94,127,177,0.1)]">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-slate-500">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-white/80 bg-white/80 p-[8px]"
              />
            </div>
            <div className="photoItem flex items-center justify-between rounded-2xl bg-white/72 px-3 py-2 shadow-[0_10px_22px_rgba(94,127,177,0.1)]">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-slate-500">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-xl border border-white/80 bg-white/80 p-[8px]"
              />
            </div>
            
           
          </div>
        </div>
        

        <button
          onClick={handleBlock}
          className="chatbee-danger-btn mt-3 cursor-pointer rounded-2xl p-2.5 text-sm font-semibold transition"
        >
          {isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "Unblock User" : "Block User"}
        </button>
        <button
          className="chatbee-primary-btn cursor-pointer rounded-2xl p-2 text-sm font-semibold transition"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
