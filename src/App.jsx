import { useEffect } from "react";
import bg from "./assets/bg.png";
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
  const { chatsId, clearChat } = usechatStore();

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
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(64,149,255,0.18),rgba(255,255,255,0.16),rgba(255,211,72,0.22))]"></div>

        <div className="chatbee-panel relative z-10 rounded-[28px] px-10 py-8 text-3xl font-semibold text-slate-800">
          Loading...
        </div>
      </div>
    );

  return (
    <div
      className="relative flex min-h-screen w-screen items-center justify-center bg-cover bg-center p-0 sm:p-3 md:p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-white/22 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,135,255,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,211,72,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]"></div>
      <div
        className="chatbee-shell relative z-10 flex h-screen w-screen overflow-hidden rounded-none text-slate-800 backdrop-blur-2xl sm:h-[96dvh] sm:w-[96vw] sm:max-w-[1440px] sm:rounded-[32px] md:h-[95vh]"
      >
        {currentUser ? (
          <>
            <div
              className={`${
                chatsId ? "hidden md:block" : "block"
              } w-full min-w-0 border-r border-white/35 md:w-[320px] lg:w-[28%]`}
            >
              <List />
            </div>

            <div
              className={`${
                chatsId ? "flex" : "hidden md:flex"
              } min-w-0 flex-1 border-r border-white/35`}
            >
              {chatsId ? (
                <Chat onBack={clearChat} />
              ) : (
                <div className="m-auto max-w-sm rounded-[28px] chatbee-panel px-8 py-10 text-center">
                  <p className="text-lg font-semibold text-slate-800">Choose a chat to start messaging</p>
                  <p className="mt-2 text-sm chatbee-soft-text">Pick any conversation from the left panel.</p>
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
