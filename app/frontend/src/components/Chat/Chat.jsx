import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import Response from "./Response";
import SendMessage from "./SendMessage";
import { useParams } from "react-router-dom";
import { LoaderIcon } from "react-hot-toast";

const Chat = ({ HomeData, BoldData,isUploasdPdf }) => {
  // States
  const token = JSON.parse(localStorage.getItem("User"));
  const [loading, setloading] = useState(false);
  const [chatStart, setchatStart] = useState(false);
  const [user_question, setuser_question] = useState("");
  const [response, setresponse] = useState("");
  const [chatList, setchatList] = useState([]);

  //
  const sendRequest = async (userQuestion, token) => {
    // Response

    try {
      setloading(true);
      setuser_question("");
      const response = await axios.post(
        "http://localhost:8000/query",
        {
          user_question: userQuestion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.statusText === "OK") {
        setchatList([
          ...chatList,
          { request: userQuestion, response: marked(response.data.response) },
        ]);
       
        setloading(false);
      }

      return response.data;
    } catch (error) {
      console.error("Error sending query:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="w-[80%] flex flex-col justify-center items-center gap-10 lg:w-[70%] pt-20 h-screen">
        <ul className="chatbox custom-scrollbar rounded-lg h-[80%] px-20 overflow-y-auto">
          {chatStart ? (
            loading ? (
              <div className="flex items-center justify-center text-4xl h-full px-20 gap-2">
                <LoaderIcon color="black w-16 h-16" />
                <p className="text-primary text-lg">Thinking...</p>
              </div>
            ) : (
              chatList.map((chatList) => {
                return (
                  <>
                    <div className="send flex justify-end">
                      <SendMessage message={chatList.request} />
                    </div>

                    <div className="response w-[100%]">
                      <Response message={chatList.response} Loading={loading} />
                    </div>
                  </>
                );
              })
            )
          ) : (
            <div className="flex items-center justify-center text-3xl h-full px-20 gap-2">
              {" "}
              {isUploasdPdf ? (
                    <>
                    {" "}
                    <strong>{BoldData}</strong> {HomeData}
                  </>
               
              ) : (
                <p className="text-primary text-lg">Please upload pdf file</p>
              )}
            </div>
          )}
        </ul>
        <div className="input-field w-[70%] mx-auto h-[12%] flex flex-row items-center justify-center p-2">
          <input
            className="w-[80%] h-full outline-none border-2 border-primary px-2 rounded-s-lg"
            type="text"
            placeholder="How can i help you ?"
            value={user_question}
            onChange={(e) => {
              setuser_question(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              setchatStart(true);
              sendRequest(user_question, token.access_token);

              console.log(response);
            }}
            className="w-[20%] h-full text-lg font-semibold px-4 text-white rounded-e-lg bg-primary flex items-center justify-center"
          >
            Send <IoMdSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
