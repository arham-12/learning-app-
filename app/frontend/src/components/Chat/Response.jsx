import React, { useEffect } from "react";
import { FaTruckLoading } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";

const Response = ({Loading, message }) => {


  return (
    <div class="flex my-5 items-start gap-4 w-full space-x-4">
      <a
        href="/profile"
        className="rounded-full p-2 transition-all border-2 border-white cursor-pointer bg-black"
      >
        <RiRobot3Fill className="text-xl text-primary" />
      </a>

      <div class="bg-zinc-900 text-white py-1 px-2 rounded-lg shadow-lg w-full">
        {Loading ? (
          "Thinking..."
        ) : (
          <span className="p-3"  dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </div>
    </div>
  );
};

export default Response;
