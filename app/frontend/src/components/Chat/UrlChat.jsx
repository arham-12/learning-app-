import React, { useEffect, useState } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import Response from "./Response";
import SendMessage from "./SendMessage";
import { useParams } from "react-router-dom";

const UrlChat = (ChatList, SetChatList, ChatStart, SetChatStart) => {
  // States
  const [chatStart, setchatStart] = useState(false);
  const { url } = useParams();
  const [request, setrequest] = useState("");
  const [response, setresponse] = useState(
    "How can i help you pleas tell ! ...."
  );
  const [chatList, setchatList] = useState([]);

 

 

  return (
    <>
      <div className="w-[70%] pt-20 h-screen">
        <ul className="chatbox h-[80%] px-20 bg-black rounded-b-md overflow-y-auto">
          {chatStart ? (
            chatList.map((chatList) => {
              return (
                <>
                  <div className="send flex justify-end">
                    <SendMessage message={chatList.request} />
                  </div>

                  <div className="response">
                    <Response message={chatList.response} />
                  </div>
                </>
              );
            })
          ) : (
            <div className=" flex items-center justify-center text-4xl h-full gap-2">
              {" "}
              <strong>Welcome </strong> to chat with your own bot !
            </div>
          )}
        </ul>
        <div className="input-field w-[70%] mx-auto h-[12%] flex flex-row items-center justify-center bg-black p-2">
          <input
            className="w-[80%] h-full bg-black outline-none border-2 border-primary px-2 rounded-s-lg"
            type="text"
            placeholder="How can i help you ?"
            value={request}
            onChange={(e) => {
              setrequest(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setchatStart(true);
              setchatList([
                ...chatList,
                { request: request, response: response },
              ]);
            }}
            className="w-[20%] h-full text-lg font-semibold px-4 rounded-e-lg bg-primary flex items-center justify-center"
          >
            Send <IoMdSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default UrlChat;
