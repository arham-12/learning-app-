import axios from "axios";
import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate()
  const [inputs, setinputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setinputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/signup", inputs)
      .then((res) => {
        if(res.statusText === "OK"){
          toast.success("Sign Up Successfull");
          navigate("/login");
        }else{
          toast.error(res.data.response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="login px-5 w-full h-screen flex flex-col justify-center items-center">
        <div className="login px-5 w-full lg:w-[30%] flex flex-col justify-center border border-primary rounded-lg py-5 items-center">
          <div className="heading text-2xl lg:text-4xl font-bold py-5">
            SignUp
          </div>
          <form className="form text-black w-full px-5 flex flex-col gap-3 justify-center items-center">
            <input
              className="px-3 py-2 border border-primary rounded-lg w-full outline-none"
              value={inputs.username}
              onChange={onChangeHandler}
              name="username"
              placeholder="Enter Name"
              type="text"
            />
            <input
              className="px-3 py-2 border border-primary rounded-lg w-full outline-none"
              value={inputs.email}
              onChange={onChangeHandler}
              name="email"
              placeholder="Enter email"
              type="text"
            />
            <input
              className="px-3 py-2 border border-primary rounded-lg w-full  outline-none"
              value={inputs.password}
              onChange={onChangeHandler}
              name="password"
              placeholder="Enter password"
              type="password"
            />
            <button
              onClick={onSubmitHandler}
              className="w-full rounded-lg py-2 bg-primary text-white"
            >
              SignUp
            </button>
          </form>
          <p className="my-2 text-sm">
            Already have account ?{" "}
            <Link to={"/login"} className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
