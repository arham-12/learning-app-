import React, { useState } from 'react'
import Chat from '../components/Chat/Chat'
import UploadFile from '../components/Chat/UploadFile'

const ChatPage = () => {
  const [isUploasdPdf, setisUploasdPdf] = useState(false);
  return (
<>
<div className='h-screen w-full flex justify-center items-center'>
    <UploadFile SetIsUpload={setisUploasdPdf}/>
    <Chat isUploasdPdf={isUploasdPdf} HomeData={"What's Your Query About PDF"} BoldData={"Hi!"}/>
</div>
</>
  )
}

export default ChatPage