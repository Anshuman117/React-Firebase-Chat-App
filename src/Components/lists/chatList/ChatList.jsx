import React, { useEffect, useState } from "react";
import search from "../../../assets/search.png";
import plus from "../../../assets/plus.png";
import minus from "../../../assets/minus.png";
import avatar from "../../../assets/avatar.png";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { usechatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setaddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatsId, changeChat } = usechatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatsId === chat.chatsId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, { chats: userChats });
      changeChat(chat.chatsId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="relative flex-1 overflow-y-auto px-3 pb-4">
      <div className="flex items-center gap-3 px-1 py-4">
        <div className="chatbee-input flex flex-1 items-center gap-2 rounded-2xl px-3 py-2.5">
          <img src={search} alt="" className="h-4 w-4 opacity-60" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="button"
          className="chatbee-primary-btn flex h-11 w-11 items-center justify-center rounded-2xl transition"
          onClick={() => setaddMode((prev) => !prev)}
        >
          <img src={addMode ? minus : plus} alt="" className="h-4 w-4" />
        </button>
      </div>
      {filteredChats.map((chat) => (
        <div
          onClick={() => handleSelect(chat)}
          key={chat.chatsId || `${chat.receiverId}-${chat.updatedAt}`}
          className={`mb-2 flex cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3 transition hover:-translate-y-0.5 ${
            chatsId === chat.chatsId
              ? "border-[#78B5FF] bg-[linear-gradient(135deg,rgba(89,167,255,0.18),rgba(255,255,255,0.82))] shadow-[0_12px_28px_rgba(84,138,205,0.14)]"
              : chat?.isSeen
                ? "border-white/65 bg-white/62"
                : "border-[#FFE8A1] bg-[linear-gradient(135deg,rgba(255,220,92,0.26),rgba(255,255,255,0.82))] shadow-[0_12px_28px_rgba(214,180,77,0.12)]"
          }`}
        >
          <img
            src={chat.user.blocked.includes(currentUser.id) ? avatar : chat.user.avatar || avatar}
            alt=""
            className="h-[46px] w-[46px] rounded-full border border-white/90 object-cover shadow-[0_10px_24px_rgba(97,132,182,0.18)]"
          />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-800">
              {chat.user.blocked.includes(currentUser.id)
                ? "user"
                : chat.user.username}
            </span>
            <p className="truncate text-xs chatbee-soft-text">
              {chat.user.blocked.includes(currentUser.id)
                ? "you are blocked"
                : chat.lastMessage}
            </p>
          </div>
        </div>
      ))}

      {filteredChats.length === 0 && (
        <div className="chatbee-panel mt-3 rounded-[24px] px-5 py-6 text-center">
          <p className="text-sm font-semibold text-slate-800">No chats found</p>
          <p className="mt-1 text-xs chatbee-soft-text">Start a new conversation or try another name.</p>
        </div>
      )}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
