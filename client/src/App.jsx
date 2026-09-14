import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Sign from "./pages/auth/Sign";
import Verify from "./pages/auth/Verify";
import { isUserLogged } from "./services/global";
import Display from "./pages/Display";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { Toaster } from "sonner";

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}`;
axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyingUser = async () => {
      try {
        const res = await isUserLogged();

        if (res.status != 204) throw new Error(res.response.data.message);
        return;
      } catch (error) {
        if (
          window.location.pathname != "/forgotpassword" ||
          window.location.pathname != "/verify" ||
          window.location.pathname != "/sign"
        )
          return navigate("/sign");
      }
    };

    verifyingUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/sign" element={<Sign />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<Display />} />
      </Routes>

      <Toaster position="top-center" richColors duration={2500} />
    </>
  );
}

export default App;
