import React, { useState } from "react";
import avatar from "../../assets/avatar.png";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../lib/upload";
import { use } from "react";

const Login = () => {
  const [Avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password || !Avatar.file) {
      toast.error("All fields including avatar are required");
      return;
    }

    try {
      // upload avatar to cloudinary
      const avatarUrl = await uploadToCloudinary(Avatar.file);

      // create firebase auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // save user data
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        username,
        email,
        avatar: avatarUrl,
        blocked: [],
      });

      // create empty chat list
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created! You can login now!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
  
    if (!email || !password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="Login w-full h-full flex items-center gap-24">
      <div className="item flex-1 flex flex-col gap-[20px] items-center">
        <h2 className="text-2xl">Welcome Back,</h2>
        <form
          className="flex flex-col items-center gap-[20px]"
          onSubmit={handleLogin}
        >
          <input
            className="p-[20px] border-none outline-none bg-[rgba(17,25,40,0.6)] text-white border-r-[5px] rounded-lg"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className=" rounded-lg p-[20px] border-none outline-none bg-[rgba(17,25,40,0.6)] text-white border-r-[5px]"
            type="password"
            placeholder="password"
            name="password"
          />
          <button
            disabled={loading}
            className="w-[100%] p-[20px] bg-[#1f8ef1] text-white rounded-[5px] cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-[#1f8ff19c]
"
          >
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>

      <div className="seperator h-[80%] w-[2px] bg-[#dddddd35]"></div>

      <div className="item flex-1 flex flex-col gap-[20px] items-center">
        <h2 className="text-2xl">Create an Account</h2>
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center gap-[20px]"
        >
          <label
            className="w-[100%] flex items-center justify-between cursor-pointer underline"
            htmlFor="file"
          >
            <img
              className="w-[50px] h-[50px] rounded-[10px] object-fit opacity-[0.6]"
              src={Avatar.url || avatar}
              alt=""
            />
            upload an image
          </label>

          <input
            type="file"
            id="file"
            style={{ display: "none " }}
            onChange={handleAvatar}
          />

          <input
            className="rounded-lg p-[20px] border-none outline-none bg-[rgba(17,25,40,0.6)] text-white border-r-[5px]"
            type="text"
            placeholder="Username"
            name="username"
          />

          <input
            className="rounded-lg p-[20px] border-none outline-none bg-[rgba(17,25,40,0.6)] text-white border-r-[5px]"
            type="text"
            placeholder="Email"
            name="email"
          />

          <input
            className="rounded-lg p-[20px] border-none outline-none bg-[rgba(17,25,40,0.6)] text-white border-r-[5px]"
            type="password"
            placeholder="password"
            name="password"
          />

          <button
            disabled={loading}
            className="w-[100%] p-[20px] bg-[#1f8ef1] text-white rounded-[5px] cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-[#1f8ff19c]
"
          >
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
