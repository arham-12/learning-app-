import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <div className="bg-slate-100 text-black">

        <App />
      </div>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
