import React, { useState } from "react";
import avatar from "../../assets/avatar.png";
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import emoji from "../../assets/emoji.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setopen] = useState(false);
  const [text, settext] = useState("");
  const handleEmoji = (e) => {
    console.log(e);
    settext((prev) => prev + e.emoji);
    setopen(false);
  };
  return (
    <div className=" flex-2 flex flex-col h-full">
      <div className=" top p-[20px] flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-[20px]">
          <img
            src={avatar}
            alt=""
            className="w-[60px] h-[60px]  object-cover rounded-full"
          />
          <div className="flex flex-col gap-[5px]">
            <span className="text-[18px] font-bold">anshuman</span>
            <p className="text-[14px] font-light  text-[#a5a5a5]">
              Lorem ipsum dolor sit amet{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-[20px] ">
          <img src={phone} alt="" className=" w-[20px]" />
          <img src={video} alt="" className="w-[20px]" />
          <img src={info} alt="" className="w-[20px]" />
        </div>
      </div>
      <div className="center flex flex-col overflow-y-auto gap-[20px] p-4">
        <div className="message  flex gap-[20px] items-start">
            <img src={avatar} alt="" className="w-[30px] h-[30px] rounded-full object-cover"/>
            <div className="texts max-w-[50%] text-left flex flex-col gap-[5px]">
                <p className="p-[20px] bg-[rgba(17,25,40,0.3)] rounded-lg ">lLorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it </p>
                <span className="text-xs text-gray-400">1 min ago</span>
            </div>

        </div>
        <div className="message own flex justify-end ">
            {/* <img src={avatar} alt="" /> */}
            <div className="texts max-w-[70%] text-right">
                <img src="https://images.goway.com/production/featured_images/Nyhavn-Canal-at-sunset%2C-Christmas-time%2C-Nyhavn%2CCopenhagen%2C-Denmark%2C-Europe%20_iStock-1498222113.jpg?VersionId=jVWfPcdqAn8ozZFUM8XzzcczSjkLshGi" alt=""  className=" rounded-lg mb-1 object-cover"/>
                <p className="bg-[#5183fe] text-white p-2 rounded-lg  ">Lorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it  </p>
                <span className="text-xs text-gray-400">1 min ago</span>
            </div>

        </div>
        <div className="message  w-max-[70%] flex gap-[20px]">
            <img src={avatar} alt="" className="w-[30px] h-[30px] rounded-full object-cover"/>
            <div className="texts text-left max-w-[50%] flex flex-col gap-[5px]">
                <p className="p-[20px] bg-[rgba(17,25,40,0.3)] rounded-lg ">Lorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it  </p>
                <span className="text-xs text-gray-400" >1 min ago</span>
            </div>

        </div>
        <div className="message own flex justify-end ">
            {/* <img src={avatar} alt="" /> */}
            <div className="texts max-w-[70%] text-right">
                <p className="bg-[#5183fe] text-white p-2 rounded-lg ">Lorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it   </p>
                <span className="text-xs text-gray-400">1 min ago</span>
            </div> 

        </div>
        <div className="message  w-max-[70%] flex gap-[20px]">
            <img src={avatar} alt="" className="w-[30px] h-[30px] rounded-full object-cover" />
            <div className="texts text-left max-w-[50%] flex flex-col gap-[5px]">
                <p className="p-[20px] bg-[rgba(17,25,40,0.3)] rounded-lg ">Lorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it  </p>
                <span className="text-xs text-gray-400">1 min ago</span>
            </div>

        </div>
        <div className="message own flex justify-end ">
            {/* <img src={avatar} alt="" /> */}
            <div className="texts max-w-[70%] text-right">
                <p className="bg-[#5183fe] text-white p-2 rounded-lg">Lorem ipsum dolor sit amet Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it  </p>
                <span className="text-xs text-gray-400">1 min ago</span>
            </div>

        </div>



      </div>
      <div className=" bottom p-[20px] flex items-center justify-between border-t border-[#dddddd35] mt-auto">
        <div className="icons flex gap-[20px] ">
          <img src={img} alt="" className="w-[20px] h-[20px] cursor-pointer" />
          <img
            src={camera}
            alt=""
            className="w-[20px] h-[20px] cursor-pointer"
          />
          <img src={mic} alt="" className="w-[20px] h-[20px] cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder="type a message..."
          className="flex-1 bg-[rgba(17,25,40,0.5)] border-none outline-none text-white p-[20px] font-[16px] rounded-xl"
          value={text}
          onChange={(e) => settext(e.target.value)}
        />
        <div className=" flex items-center ml-2 gap-2">
          <div className="relative ">
            <img
              src={emoji}
              alt=""
              className="w-[20px] h-[20px] cursor-pointer "
              onClick={() => setopen((prev) => !prev)}
            />
            <div className=" absolute bottom-[50px] left-0">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <div className="">
            <button className="bg-[#5183fe] text-white pr-[10px] pl-[10px] border-none cursor-pointer rounded-[5px]">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
