import React, { useContext, useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../Context/authContext";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutBox, setlogoutBox] = useState(false);

    const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutItems = [
    { name: "Home", url: "/" },
  ];
  const loginItems = [
    { name: "Home", url: "/" },
    { name: "Learning Material", url: "/search" },
    { name: "Chat with PDF", url: "/chat" },
    { name: "Vailidate Yourself", url: "/quiz" },
  ];

  const logOut = () => {
    axios
      .delete(
        `https://blog-master-server.vercel.app/api/user/logout/${userData.userId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          navigate("/");
          toast.success(res.data.message);
          logoutUser();
        } else {
          toast.error(res.data.message);
        }
      });
  };
  return (
    <>
      {/* Dialog box to ask confirm or not */}
      <dialog
        id="my_modal_1"
        className={`h-screen ${
          logoutBox ? "flex" : "hidden"
        } w-full justify-center items-center bg-transparent`}
      >
        <div className="w-[80%] lg:w-[30%] h-[20%] lg:h-[40%] rounded-lg flex justify-center items-center flex-col gap-4 bg-black border border-primary">
          <h3 className="font-bold text-xl text-white">Want to logout?</h3>
          <div className="modal-action ">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={logOut}
                className="py-1 transition-all px-4 rounded-lg text-sm text-black bg-primary hover:bg-white hover:text-black mx-2"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setlogoutBox(false);
                }}
                className="py-1 px-4 transition-all rounded-lg text-sm text-black bg-primary hover:bg-white hover:text-black"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <nav className="nav text-white font-medium bg-black fixed w-full z-20 flex justify-between items-center py-3 lg:py-3 px-6 lg:px-20 ">
        <div className="nav-start-section lg:w-[30%] w-[45%]">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="logo cursor-pointer"
          >
            <h1 className="flex items-center gap-2 font-bold">
              <img className="text-primary w-10" src="/favicon.png" alt="" />
              <span className="text-sm lg:text-lg">SmartLearn AI</span>
            </h1>
          </div>
        </div>
        <div className="nav-middle-section hidden md:flex space-x-4 justify-center lg:w-[40%]">
          <ul className="list-items flex items-center justify-center gap-5 ">
            {isLogin
              ? loginItems.map((item) => {
                  return (
                    <Link
                      to={item.url}
                      className="list-item px-1 transition-all hover:border-b hover:text-primary border-primary cursor-pointer"
                    >
                      <li>{item.name}</li>
                    </Link>
                  );
                })
              : logoutItems.map((item) => {
                  return (
                    <Link
                      to={item.url}
                      className="list-item px-3 transition-all hover:border-b hover:text-primary border-primary cursor-pointer"
                    >
                      <li>{item.name}</li>
                    </Link>
                  );
                })}
          </ul>
        </div>
        <div className="nav-end-section items-end justify-end lg:w-[30%] w-[45%] hidden md:flex space-x-4">
          <div className="buttons hidden lg:flex items-center justify-end gap-2">
            {isLogin ? (
              <>
              
              </>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="singup-btn rounded-lg py-1 px-5 font-medium transition-all bg-transparent cursor-pointer  hover:bg-primary hover:font-normal hover:text-black"
                >
                  SignUp
                </Link>
                <Link
                  to={"/login"}
                  className="singup-btn rounded-lg py-1 px-5 transition-all bg-transparent border-2 border-primary cursor-pointer hover:bg-primary hover:text-black"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden z-50 flex items-center gap-4">
          <button className="text-white focus:outline-none z-10 text-2xl">
            {isOpen ? (
              <IoMdClose onClick={() => setIsOpen(!isOpen)} />
            ) : (
              <HiOutlineMenuAlt3 onClick={() => setIsOpen(!isOpen)} />
            )}
          </button>
        </div>

        {/* mobile menu */}
        {isOpen && (
          <div className="md:hidden w-[50%] flex flex-col justify-between py-20 gap-10 z-30 px-4 absolute bg-zinc-950 right-0 top-0  h-screen">
            <div className="links flex flex-col justify-center gap-2">
              {isLogin
                ? loginItems.map((item) => {
                    return (
                      <Link
                        href={item.url}
                        className="list-items text-center list-none py-1 px-5 bg-zinc-900 rounded-full transition-all hover:bg-primary cursor-pointer"
                      >
                        <li>{item.name}</li>
                      </Link>
                    );
                  })
                : logoutItems.map((item) => {
                    return (
                      <Link
                        href={item.url}
                        className="list-items text-center list-none py-1 px-5 bg-zinc-900 rounded-full transition-all hover:bg-primary cursor-pointer"
                      >
                        <li>{item.name}</li>
                      </Link>
                    );
                  })}
            </div>
            <div className="btns flex flex-col justify-center gap-2">
              {isLogin ? (
                <>
                </>
              ) : (
                <>
                  <Link
                    to={"/signup"}
                    className="singup-btn text-center rounded-full py-1 px-5 transition-all bg-transparent border-2 border-primary cursor-pointer hover:bg-primary hover:text-black"
                  >
                    SignUp
                  </Link>
                  <Link
                    to={"/login"}
                    className="singup-btn text-center rounded-full py-1 px-5 transition-all bg-transparent border-2 border-primary cursor-pointer hover:bg-primary hover:text-black"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;
