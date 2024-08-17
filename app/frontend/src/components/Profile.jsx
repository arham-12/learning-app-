import React from 'react'
import { CiMail } from 'react-icons/ci'

const Profile = () => {
  return (
   <>
   <div className=' h-screen '>
   <div className="top px-10  w-full flex flex-col items-center justify-center gap-4 pt-36">
          {/* Profile image and username */}
          <div className="right-top w-full md:w-[50%] flex-col flex justify-center items-center gap-5">
            {/* User profile pic */}
            <img
              className="w-40 rounded-full border-2 border-primary"
              src={"/default-profile.jpg"}
              alt="logo"
            />
            <p className="text-2xl font-semibold">{`@taha`}</p>
            <p className="text-2xl text-primary gap-2 font-semibold flex items-center">
              <CiMail />{" "}
              <span className="font-normal text-lg text-white">
                taha@gmail.com
              </span>
            </p>
          </div>

        
        </div>
   </div>
   </>
  )
}

export default Profile