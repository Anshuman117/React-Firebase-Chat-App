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
    <div className="relative flex-1 overflow-y-auto">
      <div className="flex items-center gap-3 p-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/45 px-3 py-2">
          <img src={search} alt="" className="h-4 w-4 opacity-75" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />
        </div>
        <img
          src={addMode ? minus : plus}
          alt=""
          className="h-9 w-9 cursor-pointer rounded-xl border border-white/15 bg-slate-900/45 p-2 transition hover:bg-slate-800/70"
          onClick={() => setaddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          onClick={() => handleSelect(chat)}
          key={chat.chatsId || `${chat.receiverId}-${chat.updatedAt}`}
          className={`flex cursor-pointer items-center gap-3 border-b border-white/10 px-4 py-3 transition hover:bg-slate-800/45 ${
            chat?.isSeen ? "bg-transparent" : "bg-cyan-500/25"
          }`}
        >
          <img
            src={chat.user.blocked.includes(currentUser.id) ? avatar : chat.user.avatar || avatar}
            alt=""
            className="h-[46px] w-[46px] rounded-full border border-white/20 object-cover"
          />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-100">
              {chat.user.blocked.includes(currentUser.id)
                ? "user"
                : chat.user.username}
            </span>
            <p className="truncate text-xs text-slate-300">
              {chat.user.blocked.includes(currentUser.id)
                ? "you are blocked"
                : chat.lastMessage}
            </p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
