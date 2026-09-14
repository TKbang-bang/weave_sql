import jwt from "jsonwebtoken";
import { getUserById } from "../helpers/users.helper.js";

export const ioAuth = async (socket, next) => {
  // getting token from socket
  const token = socket.handshake.auth?.token.split(" ")[1];
  if (!token) return next(new Error("Token was not found in socket"));

  try {
    // verifying token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { userID } = decoded;

    // getting user by token user id
    const user = await getUserById(userID);
    if (!user) return next(new Error("User not found"));

    socket.userID = userID;
    return next();
  } catch (error) {
    console.error({ error });
    return next(new Error("Authentication error"));
  }
};

export const setUserOnline = (socket, onlineUsers) => {
  if (!socket.userID) return socket.disconnect(true);

  const userSockets = onlineUsers.get(socket.userID) || new Set();
  userSockets.add(socket.id);
  onlineUsers.set(socket.userID, userSockets);
};

export const setUserOffline = (socket, onlineUsers) => {
  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(socket.userID);
    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(socket.userID);
    }

    console.log("Socket disconnected:", socket.id);
  });
};
