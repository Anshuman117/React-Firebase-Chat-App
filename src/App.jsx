import { useEffect } from "react";
import bg from "./assets/bg.jpg";
import Chat from "./Components/chat/Chat";
import Detail from "./Components/detail/Detail";
import List from "./Components/lists/List";
import Login from "./Components/login/Login";
import Notification from "./Components/Notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { usechatStore } from "./lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatsId } = usechatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      } else {
        fetchUserInfo(null);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  // 🔹 LOADING SCREEN (FIXED)
  if (isLoading)
    return (
      <div
        className="relative flex h-screen w-screen items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"></div>

        <div className="relative z-10 rounded-2xl border border-white/20 bg-slate-900/70 px-10 py-8 text-3xl font-semibold text-white shadow-2xl">
          Loading...
        </div>
      </div>
    );

  return (
    <div
      className="relative flex min-h-screen w-screen items-center justify-center bg-cover bg-center p-2 sm:p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>
      <div
        className="relative z-10 flex h-[95vh] w-[96vw] max-w-[1440px] overflow-hidden rounded-3xl border border-white/20 bg-slate-950/45 text-white shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      >
        {currentUser ? (
          <>
            <div className="w-full min-w-0 border-r border-white/15 md:w-[320px] lg:w-[28%]">
              <List />
            </div>

            <div className={`${chatsId ? "flex" : "hidden md:flex"} min-w-0 flex-1 border-r border-white/15`}>
              {chatsId ? (
                <Chat />
              ) : (
                <div className="m-auto max-w-sm rounded-2xl border border-white/15 bg-slate-900/50 px-8 py-10 text-center">
                  <p className="text-lg font-semibold text-slate-100">Choose a chat to start messaging</p>
                  <p className="mt-2 text-sm text-slate-300">Pick any conversation from the left panel.</p>
                </div>
              )}
            </div>

            <div className="hidden w-[320px] xl:block">{chatsId && <Detail />}</div>
          </>
        ) : (
          <Login />
        )}

        <Notification />
      </div>
    </div>
  );
}

export default App;
