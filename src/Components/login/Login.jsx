import React, { useState } from "react";
import avatar from "../../assets/avatar.png";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../lib/upload";

const Login = () => {
  const [Avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

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
    setRegisterLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password || !Avatar.file) {
      toast.error("All fields including avatar are required");
      setRegisterLoading(false);
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
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
  
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
  
    if (!email || !password) {
      toast.error("Email and password are required");
      setLoginLoading(false);
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoginLoading(false);
    }
  };
  

  return (
    <div className="Login grid h-full w-full grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2 md:items-center md:gap-0 md:p-8 lg:p-12">
      <div className="item flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-slate-900/35 p-6 md:p-8">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-sm text-slate-300">Sign in to continue your conversations.</p>
        <form
          className="flex w-full max-w-sm flex-col items-center gap-4"
          onSubmit={handleLogin}
        >
          <input
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            type="password"
            placeholder="Password"
            name="password"
          />
          <button
            disabled={loginLoading}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-700/70 disabled:text-slate-200"
          >
            {loginLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="item flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-slate-900/35 p-6 md:p-8">
        <h2 className="text-2xl font-bold">Create an Account</h2>
        <p className="text-sm text-slate-300">Set up your profile and join the chat.</p>
        <form
          onSubmit={handleRegister}
          className="flex w-full max-w-sm flex-col items-center gap-4"
        >
          <label
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-dashed border-cyan-200/40 bg-slate-900/40 p-3 text-sm text-cyan-100"
            htmlFor="file"
          >
            <img
              className="h-[48px] w-[48px] rounded-xl object-cover"
              src={Avatar.url || avatar}
              alt=""
            />
            Upload a profile image
          </label>

          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />

          <input
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            type="text"
            placeholder="Username"
            name="username"
          />

          <input
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            type="text"
            placeholder="Email"
            name="email"
          />

          <input
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            type="password"
            placeholder="Password"
            name="password"
          />

          <button
            disabled={registerLoading}
            className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-700/60"
          >
            {registerLoading ? "Loading..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
