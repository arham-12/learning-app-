import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import Loading from "../Loaiding";
import { toast } from "react-hot-toast";

const UploadFile = ({SetIsUpload}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  
 

  // Input handle function
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Submit file function
  const handleUpload = async () => {
    if (!file) return console.log("please enter file");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(response.statusText === "OK"){
        toast.success(response.data.response);
        setLoading(false);
        SetIsUpload(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };
  if(loading) return  <div className="top-0 absolute w-full h-screen text-black bg-white"><Loading Text={"File Is Processing Please Wait..."}/></div>

  return (
    <>
      <div className="w-[30%] bg-blue-100 h-screen flex flex-col gap-2 items-center justify-between py-32 p-4">
       <div className="flex flex-col gap-2 items-center justify-center p-4">

      
        <h1 className="text-3xl text-center font-bold text-primary">
          Upload Document
        </h1>
        <p>Upload file for preprocess!</p>
        
        <div className="buttons flex gap-3 items-center justify-center">
          <label
            className="cursor-pointer  font-semibold px-4 py-2 border border-primary hover:bg-primary rounded-md"
            htmlFor="input-file"
          >
            <FaFileUpload className="text-xl" />
          </label>
          <input
            
            onChange={handleFileChange}
            className="hidden"
            id="input-file"
            type="file"
          />
          <label
            onClick={handleUpload}
            className=" cursor-pointer  font-semibold px-4 py-2 border border-primary hover:bg-primary rounded-md"
          >
            <IoIosSend className="text-xl" />
          </label>
          </div>
        </div>
    
      </div>
    </>
  );
};

export default UploadFile;
