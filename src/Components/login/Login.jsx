import React, { useState } from "react";
import avatar from "../../assets/avatar.png";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../lib/upload";
import chatbeerm from "../../assets/chatbeerm.png";

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
    <div className="Login flex h-full w-full flex-col justify-center gap-6 overflow-y-auto px-4 py-6 sm:px-5 sm:py-8 md:gap-8 md:p-8 lg:p-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-0 text-center">
        <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#0B58C9] shadow-[0_10px_24px_rgba(74,128,196,0.14)] sm:px-4 sm:text-xs sm:tracking-[0.35em]">
          ChatBee
        </span>

        <span className="mt-1 flex w-48 justify-center sm:w-56 md:w-72">
          <img src={chatbeerm} alt="" className="block w-full drop-shadow-[0_18px_30px_rgba(74,128,196,0.16)]" />
        </span>

        <span className="-mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:-mt-6 sm:gap-2">
          <h1 className="m-0 text-2xl font-extrabold leading-none text-slate-800 sm:text-3xl md:text-5xl">
            Welcome To
          </h1>
          <h1 className="m-0 text-2xl font-extrabold leading-none text-[#0B58C9] sm:text-3xl md:text-5xl">
            Chat
          </h1>
          <h1 className="m-0 text-2xl font-extrabold leading-none text-[#F4C20D] sm:text-3xl md:text-5xl">
            Bee
          </h1>
        </span>

        <p className="mt-2 max-w-xl px-2 text-sm chatbee-soft-text sm:mt-3 md:max-w-2xl md:text-base">
          Jump back into your chats or create a new account to get started.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
        <div className="chatbee-panel-blue item flex flex-col items-center gap-4 rounded-[24px] p-5 sm:gap-5 sm:rounded-[28px] sm:p-6 md:p-8">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B58C9]">
            Returning User
          </span>
          <h2 className="text-3xl font-bold text-[#0B58C9]">Welcome Back</h2>
          <p className="text-sm chatbee-soft-text text-center">
            Sign in to continue your conversations.
          </p>
          <form
            className="flex w-full max-w-sm flex-col items-center gap-3 sm:gap-4"
            onSubmit={handleLogin}
          >
            <input
              className="chatbee-input w-full rounded-2xl px-4 py-3 outline-none transition"
              type="text"
              placeholder="Email"
              name="email"
            />
            <input
              className="chatbee-input w-full rounded-2xl px-4 py-3 outline-none transition"
              type="password"
              placeholder="Password"
              name="password"
            />
            <button
              disabled={loginLoading}
              className="chatbee-primary-btn w-full rounded-2xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed"
            >
              {loginLoading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>

        <div
          className="mx-auto h-px w-24 rounded-full bg-gradient-to-r from-[#67AFFF]/0 via-[#67AFFF] to-[#FFD55C]/0 lg:h-48 lg:w-px lg:bg-gradient-to-b"
          aria-hidden="true"
        />

        <div className="chatbee-panel-yellow item flex flex-col items-center gap-4 rounded-[24px] p-5 sm:gap-5 sm:rounded-[28px] sm:p-6 md:p-8">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#B88500]">
            New Here
          </span>
          <h2 className="text-3xl font-bold text-[#8A6700]">Create an Account</h2>
          <p className="text-sm chatbee-soft-text text-center">
            Set up your profile and join the chat.
          </p>
          <form
            onSubmit={handleRegister}
            className="flex w-full max-w-sm flex-col items-center gap-3 sm:gap-4"
          >
            <label
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-[#F0C955] bg-white/75 p-3 text-sm font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
              htmlFor="file"
            >
              <img
                className="h-[48px] w-[48px] rounded-xl border border-white/80 object-cover"
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
              className="chatbee-input w-full rounded-2xl px-4 py-3 outline-none transition"
              type="text"
              placeholder="Username"
              name="username"
            />

            <input
              className="chatbee-input w-full rounded-2xl px-4 py-3 outline-none transition"
              type="text"
              placeholder="Email"
              name="email"
            />

            <input
              className="chatbee-input w-full rounded-2xl px-4 py-3 outline-none transition"
              type="password"
              placeholder="Password"
              name="password"
            />

            <button
              disabled={registerLoading}
              className="chatbee-secondary-btn w-full rounded-2xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed"
            >
              {registerLoading ? "Loading..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
