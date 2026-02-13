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
  console.log(currentUser)

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
    <div className="details flex-1">
      <div className="user flex flex-col items-center gap-[15px] px-[20px] py-[30px] border-b border-[#dddddd35] ">
        <img
          src={user?.avatar||avatar}
          alt=""
          className="w-[100px] h-[100px] object-cover rounded-full "
        />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet consectetur</p>
      </div>
      <div className="info p-[20px] flex flex-col gap-[10px] ">
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Chat Setting</span>
            <img
              src={arrowUp}
              alt=""
              className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Chat Setting</span>
            <img
              src={arrowUp}
              alt=""
              className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Privacy % help</span>
            <img
              src={arrowUp}
              alt=""
              className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
            />
          </div>
        </div>
        <div className="options">
          <div className="title flex items-center justify-between">
            <span>Shared photos</span>
            <img
              src={arrowDown}
              alt=""
              className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
            />
          </div>

          <div className="photo flex flex-col gap-[20px] mt-5">
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-[20px]">
                <img
                  className="w-[40px] h-[40px] object-cover rounded-md"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-[14px] text-gray-300 font-light">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-[20px]">
                <img
                  className="w-[40px] h-[40px] object-cover rounded-md"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-[14px] text-gray-300 font-light">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-[20px]">
                <img
                  className="w-[40px] h-[40px] object-cover rounded-md"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-[14px] text-gray-300 font-light">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
              />
            </div>
            <div className="photoItem flex items-center justify-between">
              <div className="photoDetail flex items-center gap-[20px]">
                <img
                  className="w-[40px] h-[40px] object-cover rounded-md"
                  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg"
                  alt=""
                />
                <span className="text-[14px] text-gray-300 font-light">
                  Photo_Iova.png
                </span>
              </div>
              <img
                src={download}
                alt=""
                className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="options mt-">
          <div className="title flex items-center justify-between">
            <span>Shared Files</span>
            <img
              className="w-[30px] h-[30px] p-[10px]  bg-[rgba(17,25,40,0.3)] cursor-pointer rounded-md"
              src={arrowUp}
              alt=""
            />
          </div>
        </div>

        <button
          onClick={handleBlock}
          className="p-[10px] bg-[rgba(230,74,105,0.553)] text-white border-0 rounded-[5px] hover:bg-[rgba(220,20,60,0.796)] cursor-pointer"
        >
          {isCurrentUserBlocked ? "you are blocked":isReceiverBlocked?"User Blocked":"Block User"}
        </button>
        <button
          className="p-[5px] rounded-[5px] bg-[#1a73e8] cursor-pointer hover:bg-[#1a5fe8]"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
