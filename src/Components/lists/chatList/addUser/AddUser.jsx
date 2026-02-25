import React, { useState } from "react";
import avatar from "../../../../assets/avatar.png";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, SetUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        SetUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, { createdAt: serverTimestamp(), messages: [] });

      await updateDoc(doc(userChatsRef,user.id),{
        chats:arrayUnion({
          chatsId: newChatRef.id,
          lastMessage:"",
          receiverId : currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef,currentUser.id),{
        chats:arrayUnion({
          chatsId: newChatRef.id,
          lastMessage:"",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
       
      console.log(newChatRef.id)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="AddUser absolute inset-0 z-20 m-auto h-max w-[92%] max-w-md rounded-2xl border border-white/20 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          className="flex-1 rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
          type="text"
          placeholder="Username"
          name="username"
        />
        <button className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400">
          Search
        </button>
      </form>
      {user && (
        <div className="user mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/60 px-3 py-3">
          <div className="detail flex items-center gap-3">
            <img
              className="h-10 w-10 rounded-full border border-white/25 object-cover"
              src={user.avatar || avatar}
              alt=""
            />
            <span className="text-sm font-semibold text-slate-100">{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="cursor-pointer rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
