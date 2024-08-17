import React, { useState } from "react";
import { IoChatbubbles } from "react-icons/io5";
import InputUrlBox from "./InputUrlBox";
import { Link } from "react-router-dom";

const LinkCard = ({ link, Title, Image }) => {
  const [urlBox, setUrlBox] = useState(false);

  // Encode the link to handle special characters
  const encodedLink = encodeURIComponent(link);

  return (
    <>
      <InputUrlBox Show={urlBox} SetShow={setUrlBox} />
      <div className="flex h-[150px] w-[90%] items-center gap-4">
        <div className="linkCard w-[90%] flex flex-col h-full gap-4 rounded-lg border-2 border-primary p-5">
     
          <div className="content flex items-center gap-3 h-[50%] w-full">
          <img
              className="w-10 h-10 object-cover rounded-full"
              src={Image}
              alt="link image"
            />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="link flex items-center text-sm"
            >
              {link}
            </a>
          
          </div>
          <div className="title w-full h-[50%] text-lg font-bold text-primary">{Title}</div>
        </div>
        <Link
          to={`/chat/${encodedLink}`}
          className="w-[10%] flex flex-col justify-center items-center cursor-pointer"
        >
          <IoChatbubbles onClick={() => setUrlBox(true)} className="text-3xl text-primary" />
            <p className="text-sm text-center">Chat with Page</p>
        </Link>
      </div>
    </>
  );
};

export default LinkCard;
