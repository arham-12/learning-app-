import React, { useEffect, useState } from "react";
import Chat from "../components/Chat/Chat";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loaiding";
import toast from "react-hot-toast";

const chatUrlPage = () => {
  const { url } = useParams();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const uploadUrl = async () => {
        setloading(true)
      await axios
        .post(`http://localhost:8000/website_url`, { url })
        .then((res) => {
        if(res.statusText === "OK"){
            toast.success(res.data.response);
            setloading(false)
        }
        });
    };

    return () => {
      if (url !== "") {
        uploadUrl();
      }
    };
  }, [url]);
  if(loading) return  <div className="top-0 absolute w-full h-screen text-black"><Loading Text={"Processing..."}/></div>
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <Chat isUploasdPdf={true} HomeData={"What's Your Query About This Site"} BoldData={"Hi!"}/>
    </div>
  );
};

export default chatUrlPage;
