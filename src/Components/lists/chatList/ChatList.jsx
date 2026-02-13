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

  const filteredChats=chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="flex-1 overflow-scroll">
      <div className="flex items-center gap-[30px] p-[20px]">
        <div
          className="flex bg-[rgba(17,25,40,0.5)] rounded-full
  "
        >
          <img src={search} alt="" className="w-[20px] h-[20px] p-0.5" />
          <input onChange={(e)=>setInput(e.target.value)}
            type="text"
            placeholder="Search"
            className="
    bg-transparent
    border-none
    outline-none
    focus:outline-none
    focus:ring-0
    text-white
    placeholder-gray-400
  "
          />
        </div>
        <img
          src={addMode ? minus : plus}
          alt=""
          className="w-[20px] h-[20px] bg-[rgba(17,25,40,0.5)] rounded-xl p-0 hover  cursor-pointer"
          onClick={() => setaddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          onClick={() => handleSelect(chat)}
          key={chat.chatsId || `${chat.receiverId}-${chat.updatedAt}`}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
          className=" flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35] "
        >
          <img
            src={ chat.user.blocked.includes(currentUser.id)?{avatar}:chat.user.avatar || avatar}
            alt=""
            className="w-[50px] h-[50px]  object-cover rounded-full "
          />
          <div className="flex flex-col gap-[10px]">
            <span className="font-medium">
              {chat.user.blocked.includes(currentUser.id)
                ? "user"
                : chat.user.username}
            </span>
            <p className="font-[14px] font-light">
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
