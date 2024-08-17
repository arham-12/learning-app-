import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

const Login = () => {
  const { setisLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputs, setinputs] = useState({
    username: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setinputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append form data manually
      formData.append("username", inputs.username);
      formData.append("password", inputs.password);
      // Send the form data using axios
      const response = await axios.post(
        "http://localhost:8000/login",
        formData
      );
   
      
      if (response.statusText === "OK") {
        setisLogin(true);
        navigate("/");
        localStorage.setItem("User", JSON.stringify(response.data));
        toast.success("Login Successfull");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="login px-5 w-full h-screen flex flex-col justify-center items-center ">
        <div className="login-form px-5 w-full lg:w-[30%] flex flex-col justify-center border-2 border-primary rounded-lg py-5 items-center">
          <div className="heading text-2xl lg:text-4xl font-bold py-5">
            Login
          </div>
          <form className="form text-black w-full px-5 flex flex-col gap-3 justify-center items-center">
            <input
              className="px-3 py-2 border border-primary outline-none rounded-lg w-full"
              value={inputs.username}
              onChange={onChangeHandler}
              name="username"
              placeholder="Enter username"
              type="text"
            />
            <input
              className="px-3 py-2 border border-primary outline-none rounded-lg w-full"
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
              Login
            </button>
          </form>
          <p className="my-2 text-sm">
            Want account ?{" "}
            <Link to={"/signup"} className="text-primary font-medium">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
