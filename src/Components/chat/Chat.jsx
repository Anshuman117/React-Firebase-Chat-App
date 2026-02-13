import React, { useEffect, useRef, useState } from "react";
import avatar from "../../assets/avatar.png";
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import emoji from "../../assets/emoji.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";
import EmojiPicker from "emoji-picker-react";

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { uploadToCloudinary } from "../../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setopen] = useState(false);
  const [text, settext] = useState("");
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const { currentUser } = useUserStore();
  const { chatsId, user, isCurrentUserBlocked, isReceiverBlocked } =
    usechatStore();
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatsId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatsId]);

  console.log(chat);

  const handleEmoji = (e) => {
    console.log(e);
    settext((prev) => prev + e.emoji);
    setopen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (!text && !image.file) return;

    let imgUrl = null;

    try {
      if (image.file) {
        imgUrl = await uploadToCloudinary(image.file);
      }
      await updateDoc(doc(db, "chats", chatsId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatsRef);

        if (userChatSnapshot.exists()) {
          const userChatsdata = userChatSnapshot.data();
          const chatIndex = userChatsdata.chats.findIndex(
            (c) => c.chatsId === chatsId
          );
          userChatsdata.chats[chatIndex].lastMessage = text;
          userChatsdata.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsdata.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsdata.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImage({
      file: null,
      url: "",
    });

    settext("");
  };

  return (
    <div className=" flex-2 flex flex-col h-full">
      <div className=" top p-[20px] flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-[20px]">
          <img
            src={user?.avatar || avatar}
            alt=""
            className="w-[60px] h-[60px]  object-cover rounded-full"
          />
          <div className="flex flex-col gap-[5px]">
            <span className="text-[18px] font-bold">{user?.username}</span>
            <p className="text-[14px] font-light  text-[#a5a5a5]">
              Lorem ipsum dolor sit amet{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-[20px] ">
          <img src={phone} alt="" className=" w-[20px]" />
          <img src={video} alt="" className="w-[20px]" />
          <img src={info} alt="" className="w-[20px]" />
        </div>
      </div>
      <div className="center flex flex-col overflow-y-auto gap-[20px] p-4">
        {chat?.messages?.map((message, index) => (
          <div
            className={`message own flex ${
              message.senderId === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {" "}
            {message.img && <img src={message.img} alt="" />}
            <div className="texts max-w-[70%] text-right">
              {message.text && (
                <p className="bg-[#5183fe] text-white p-2 rounded-lg">
                  {message.text}
                </p>
              )}

              <span className="text-xs text-gray-400">
                {message.createdAt
                  ? new Date(
                      message.createdAt.seconds
                        ? message.createdAt.seconds * 1000
                        : message.createdAt
                    ).toLocaleTimeString()
                  : ""}
              </span>
            </div>
          </div>
        ))}

        {image.url && (
          <div className="message own">
            <div className="texts">
              <img src={image.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className=" bottom p-[20px] flex items-center justify-between border-t border-[#dddddd35] mt-auto">
        <div className="icons flex gap-[20px] ">
          <label htmlFor="file">
            <img
              src={img}
              alt=""
              className="w-[20px] h-[20px] cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img
            src={camera}
            alt=""
            className="w-[20px] h-[20px] cursor-pointer"
          />
          <img src={mic} alt="" className="w-[20px] h-[20px] cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder={ (isCurrentUserBlocked || isReceiverBlocked)?"you cannot send a message":"type a message"}
          className="
    flex-1 
    bg-[rgba(17,25,40,0.5)] 
    border-none 
    outline-none 
    text-white 
    p-[20px] 
    text-[16px] 
    rounded-xl 
    disabled:cursor-not-allowed 
    disabled:opacity-50
  "
          value={text}
          onChange={(e) => settext(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className=" flex items-center ml-2 gap-2">
          <div className="relative ">
            <img
              src={emoji}
              alt=""
              className="w-[20px] h-[20px] cursor-pointer "
              onClick={() => setopen((prev) => !prev)}
            />
            <div className=" absolute bottom-[50px] left-0">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <div className="">
            <button
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              className="bg-[#5183fe] text-white pr-[10px] pl-[10px] border-none cursor-pointer rounded-[5px]  disabled:bg-[#5182feb4]
    disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
