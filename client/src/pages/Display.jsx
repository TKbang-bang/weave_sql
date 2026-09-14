import React, { createContext, useMemo } from "react";
import Nav from "./components/Nav";
import Main from "./main/Main";
import { Toaster } from "sonner";
import { IoContextProvider } from "../context/socket.context";
import io from "socket.io-client";

// const socket = io()

// export const SocketContext = createContext(null);

function Display() {
  // const socket = useMemo(() => io(`${import.meta.env.VITE_SERVER_URL}`), []);

  return (
    <IoContextProvider>
      <div className="display">
        <Nav />
        <Main />
      </div>
    </IoContextProvider>
  );
}

export default Display;
