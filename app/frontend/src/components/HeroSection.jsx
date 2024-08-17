import React, { useContext } from 'react'
import { IoChatbubbles } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from '../Context/authContext';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const {isLogin} = useContext(AuthContext);
  return (
<>
<div className="main-hero gap-10 w-full bg-no-repeat bg-cover h-screen py-40 px-10 lg:pt-40 lg:px-24 flex justify-center items-center">
    <div className="content w-[50%] flex flex-col gap-10">
        <h1 className='text-4xl lg:text-7xl font-medium'>Welcome to <strong className='text-primary'>SmartLearn AI</strong></h1>
        <p className='text-[16px] lg:text-lg '>Search, chat, and learn with cutting-edge AI tools designed for effective education.</p>
        <div className="btns flex gap-4">
          {isLogin ? (<>
            <Link to='/search' className="Search-btn text-white py-2 px-10 border-2 border-primary rounded-lg flex items-center gap-2 transition-all bg-primary hover:bg-transparent hover:text-black"><FaSearch className=''/> Find Learning Material</Link>
            <Link to={'/chat'} className="Chat text-white py-2 px-10 border-2 border-primary rounded-lg flex items-center gap-2 transition-all bg-primary hover:bg-transparent hover:text-black"><IoChatbubbles className=''/> Chat  With Own Document</Link>
          </>) : (<>
          <Link to={'/signup'} className='Chat text-white py-2 px-10 border-2 border-primary rounded-lg flex items-center gap-2 transition-all bg-primary hover:bg-transparent hover:text-black' href="/signup">Let's Start Learning</Link>
          </>)}

        </div>
    </div>
    <div className="image w-[50%] flex justify-center">
      <img src="/hero.png" className='w-[80%]' alt="" />
    </div>
</div>
</>
  )
}

export default HeroSection