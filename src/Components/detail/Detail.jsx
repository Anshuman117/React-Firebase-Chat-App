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
    <div className="details h-full overflow-y-auto bg-slate-900/20">
      <div className="user flex flex-col items-center gap-3 border-b border-white/15 px-5 py-7">
        <img
          src={user?.avatar || avatar}
          alt=""
          className="h-[92px] w-[92px] rounded-full border border-white/20 object-cover"
        />
        <h2 className="text-lg font-semibold">{user?.username}</h2>
        <p className="text-center text-xs text-slate-300">Manage this conversation and privacy settings.</p>
      </div>
      <div className="info flex flex-col gap-3 p-5">
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Chat Setting</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Chat Setting</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Privacy % help</span>
            <img
              src={arrowUp}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Shared photos</span>
            <img
              src={arrowDown}
              alt=""
              className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
            />
          </div>

          <div className="photo mt-4 flex flex-col gap-3">
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-gray-300">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-gray-300">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-gray-300">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img
                  className="h-[38px] w-[38px] rounded-md object-cover"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-xs font-light text-gray-300">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
              />
            </div>
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Shared Files</span>
            <img
              className="h-[30px] w-[30px] cursor-pointer rounded-md border border-white/10 bg-slate-900/50 p-[8px]"
              src={arrowUp}
              alt=""
            />
          </div>
        </div>

        <button
          onClick={handleBlock}
          className="mt-3 cursor-pointer rounded-lg border-0 bg-rose-500/80 p-2.5 text-sm font-semibold text-white transition hover:bg-rose-500"
        >
          {isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}
        </button>
        <button
          className="cursor-pointer rounded-lg bg-sky-600 p-2 text-sm font-semibold transition hover:bg-sky-500"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
