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
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
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
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const { currentUser } = useUserStore();
  const { chatsId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
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

  const handleBlock = async () => {
    if (!user) return;

    const currentUserRef = doc(db, "users", currentUser.id);
    const receiverRef = doc(db, "users", user.id);

    try {
      if (isReceiverBlocked) {
        await updateDoc(currentUserRef, {
          blocked: arrayRemove(user.id),
        });

        await updateDoc(receiverRef, {
          blocked: arrayRemove(currentUser.id),
        });
      } else {
        await updateDoc(currentUserRef, {
          blocked: arrayUnion(user.id),
        });

        await updateDoc(receiverRef, {
          blocked: arrayUnion(currentUser.id),
        });
      }
      changeBlock();
      setMobileActionsOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(240,247,255,0.2))]">
      <div className="top flex items-center justify-between gap-3 border-b border-white/40 bg-white/34 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="shrink-0 rounded-full border border-white/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-[0_10px_20px_rgba(96,130,181,0.12)] sm:px-3 sm:text-sm md:hidden"
            >
              Back
            </button>
          )}
          <img
            src={user?.avatar || avatar}
            alt=""
            className="h-12 w-12 rounded-full border border-white/90 object-cover shadow-[0_10px_24px_rgba(84,126,191,0.14)]"
          />
          <div className="min-w-0 flex flex-col">
            <span className="truncate text-sm font-bold text-slate-800 sm:text-base">{user?.username}</span>
            <p className="text-xs chatbee-soft-text">Active conversation</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5 sm:flex">
            <img src={phone} alt="" className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100" />
          </button>
          <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5 sm:flex">
            <img src={video} alt="" className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100" />
          </button>
          <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5 md:flex">
            <img src={info} alt="" className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={() => setMobileActionsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5 md:hidden"
          >
            <img src={info} alt="" className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100" />
          </button>
        </div>
      </div>
      {mobileActionsOpen && (
        <div className="chatbee-panel mx-3 mt-3 rounded-2xl p-3 sm:mx-4 md:hidden">
          <button
            type="button"
            onClick={handleBlock}
            className="chatbee-danger-btn mb-2 block w-full rounded-xl px-3 py-2 text-sm font-semibold"
          >
            {isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "Unblock User" : "Block User"}
          </button>
          <button
            type="button"
            onClick={() => auth.signOut()}
            className="chatbee-primary-btn block w-full rounded-xl px-3 py-2 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      )}
      <div className="center flex flex-1 flex-col gap-3 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(255,214,84,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(101,172,255,0.18),transparent_28%)] px-3 py-4 sm:gap-4 sm:px-4 sm:py-5 md:px-6">
        {chat?.messages?.map((message, index) => (
          <div
            key={`${message.senderId}-${message.createdAt?.seconds || message.createdAt || index}`}
            className={`message flex ${
              message.senderId === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className={`texts max-w-[86%] sm:max-w-[78%] lg:max-w-[72%] ${message.senderId === currentUser?.id ? "text-right" : "text-left"}`}>
              {message.img && (
                <img
                  src={message.img}
                  alt=""
                  className="mb-2 max-h-[220px] w-full rounded-2xl border border-white/80 object-cover shadow-[0_12px_28px_rgba(96,129,179,0.14)]"
                />
              )}
              {message.text && (
                <p
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    message.senderId === currentUser?.id
                      ? "bg-[linear-gradient(135deg,#0B58C9,#49A1FF)] text-white shadow-[0_12px_26px_rgba(56,130,246,0.24)]"
                      : "border border-[#FFE39A] bg-[#FFF6CF] text-slate-700 shadow-[0_10px_20px_rgba(219,188,93,0.12)]"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <span className="mt-1 block text-[11px] chatbee-soft-text">
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
                className="max-h-[220px] rounded-2xl border border-[#78B5FF] object-cover shadow-[0_12px_28px_rgba(86,140,206,0.18)]"
              />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div
        className="bottom mt-auto border-t border-white/45 bg-white/36 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <div className="icons order-2 flex shrink-0 items-center gap-2 sm:order-1 sm:gap-3">
          <label htmlFor="chat-file" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5">
            <img
              src={img}
              alt=""
              className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
            />
          </label>
          <input
            type="file"
            id="chat-file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5">
            <img
              src={camera}
              alt=""
              className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
            />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5">
            <img src={mic} alt="" className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]" />
          </button>
          </div>

          <input
            type="text"
            placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message"}
            className="chatbee-input order-1 min-w-0 basis-full rounded-2xl px-3 py-2.5 text-sm outline-none transition sm:order-2 sm:basis-auto sm:flex-1 sm:px-4 sm:py-3 disabled:cursor-not-allowed disabled:opacity-50"
            value={text}
            onChange={(e) => settext(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />

          <div className="order-3 ml-auto flex shrink-0 items-center gap-2">
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B2A5B] bg-[#0B2A5B] shadow-[0_10px_22px_rgba(94,127,177,0.12)] transition hover:-translate-y-0.5"
                onClick={() => setopen((prev) => !prev)}
              >
                <img
                  src={emoji}
                  alt=""
                  className="h-[18px] w-[18px] opacity-80 transition hover:opacity-100 sm:h-[19px] sm:w-[19px]"
                />
              </button>
              <div className="absolute bottom-[46px] right-0 z-20 scale-[0.9] origin-bottom-right sm:scale-100">
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              className="chatbee-primary-btn cursor-pointer rounded-2xl px-3 py-2 text-base font-semibold transition sm:px-5 sm:py-2.5 disabled:cursor-not-allowed"
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
