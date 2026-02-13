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
        className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        <div className="relative z-10 p-[50px] text-[36px] rounded-[10px] bg-[rgba(17,25,40,0.69)] text-white">
          Loading...
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div
        className="
          bg-blue-950/40
          w-[90vw] h-[90vh]
          text-white
          border border-white/20
          rounded-2xl
          shadow-2xl
          backdrop-blur-[15px]
          saturate-200
          flex
          overflow-hidden
        "
      >
        {currentUser ? (
          <>
            <div className="w-[25%] h-full border-r border-white/20">
              <List />
            </div>

            <div className="w-[48%] h-full border-r border-white/20">
              {chatsId && <Chat />}
            </div>

            <div className="w-[25%] h-full">{chatsId && <Detail />}</div>
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
