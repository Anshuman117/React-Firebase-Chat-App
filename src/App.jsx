import bg from "./assets/bg.jpg";
import Chat from "./Components/chat/Chat";
import Detail from "./Components/detail/Detail";
import List from "./Components/lists/List";

function App() {
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
        <div className="w-[25%] h-full border-r border-white/20   ">
          <List />
        </div>
        <div className="w-[48%] h-full border-r border-white/20">
          <Chat />
        </div>

        <div className="w-[25%] h-full">
          <Detail />
        </div>
      </div>
    </div>
  );
}

export default App;
