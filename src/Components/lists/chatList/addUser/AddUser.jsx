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

const {currentUser}= useUserStore()

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
    <div className="AddUser p-[30px] bg-[rgba(17,25,40,0.79)] rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto w-max h-max">
      <form onSubmit={handleSearch} className="flex gap-[20px]">
        <input
          className="p-[20px] rounded-[10px] border-none outline-none"
          type="text"
          placeholder="username"
          name="username"
        />
        <button className="p-[20px] rounded-[10px] bg-[#1a73e8] text-white border-none cursor-pointer">
          Search
        </button>
      </form>
      {user && (
        <div className="user mt-[50px] flex items-center justify-between">
          <div className="detail flex items-center gap-[20px]">
            <img
              className="w-[50px] h-[50px] rounded-[50%] object-cover"
              src={user.avatar || avatar}
              alt=""
            />
            <span>{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="p-[10px] rounded-[10px] bg-[#1a73e8] text-white border-none cursor-pointer"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
