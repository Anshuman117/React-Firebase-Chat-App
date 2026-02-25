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

const Chat = ({ onBack }) => {
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
  }, [chat?.messages?.length, image.url]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatsId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatsId]);

  const handleEmoji = (e) => {
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
    <div className="flex h-full w-full flex-col">
      <div className="top flex items-center justify-between border-b border-white/15 px-4 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mr-1 rounded-lg border border-white/20 bg-slate-900/50 px-2 py-1 text-sm text-slate-100 md:hidden"
            >
              Back
            </button>
          )}
          <img
            src={user?.avatar || avatar}
            alt=""
            className="h-12 w-12 rounded-full border border-white/20 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold">{user?.username}</span>
            <p className="text-xs text-slate-300">Active conversation</p>
          </div>
        </div>
        <div className="flex gap-4">
          <img src={phone} alt="" className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100" />
          <img src={video} alt="" className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100" />
          <img src={info} alt="" className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100" />
        </div>
      </div>
      <div className="center flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {chat?.messages?.map((message, index) => (
          <div
            key={`${message.senderId}-${message.createdAt?.seconds || message.createdAt || index}`}
            className={`message flex ${
              message.senderId === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className={`texts max-w-[72%] ${message.senderId === currentUser?.id ? "text-right" : "text-left"}`}>
              {message.img && (
                <img
                  src={message.img}
                  alt=""
                  className="mb-2 max-h-[220px] w-full rounded-xl border border-white/15 object-cover"
                />
              )}
              {message.text && (
                <p
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    message.senderId === currentUser?.id
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800/80 text-slate-100"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <span className="mt-1 block text-[11px] text-slate-400">
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
          <div className="message flex justify-end">
            <div className="texts">
              <img
                src={image.url}
                alt=""
                className="max-h-[220px] rounded-xl border border-cyan-300/40 object-cover"
              />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div
        className="bottom mt-auto border-t border-white/15 px-3 py-2 sm:px-4 sm:py-3"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
          <div className="icons flex shrink-0 items-center gap-2 sm:gap-3">
          <label htmlFor="chat-file">
            <img
              src={img}
              alt=""
              className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
            />
          </label>
          <input
            type="file"
            id="chat-file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img
            src={camera}
            alt=""
            className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
          />
          <img src={mic} alt="" className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]" />
          </div>

          <input
            type="text"
            placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message"}
            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-900/65 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/50 sm:px-4 sm:py-3 disabled:cursor-not-allowed disabled:opacity-50"
            value={text}
            onChange={(e) => settext(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <img
                src={emoji}
                alt=""
                className="h-[18px] w-[18px] cursor-pointer opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
                onClick={() => setopen((prev) => !prev)}
              />
              <div className="absolute bottom-[38px] right-0 z-20">
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              className="cursor-pointer rounded-xl bg-cyan-500 px-3 py-2 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 sm:px-5 sm:py-2.5 disabled:cursor-not-allowed disabled:bg-cyan-800/70 disabled:text-slate-300"
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
