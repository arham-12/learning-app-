import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogin, setisLogin] = useState(false);

  setTimeout(() => {
    setisLogin(false)
  },900000)
  return (
    <AuthContext.Provider value={{ isLogin , setisLogin }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
