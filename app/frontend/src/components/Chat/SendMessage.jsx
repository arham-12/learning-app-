import React from "react";
import { FaUser } from "react-icons/fa";

const SendMessage = ({ message }) => {
  
  return (
    <div class="flex my-5 items-center flex-row-reverse gap-4 space-x-4">
      

      <div class="bg-primary text-white py-1 px-2 rounded-lg shadow-lg max-w-xs">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SendMessage;
