import axios from "axios";
import api from "./api.service";

export const registerData = async (
  firstname,
  lastname,
  username,
  email,
  password,
) => {
  const response = await axios.post("/auth/signup", {
    firstname,
    lastname,
    username,
    email,
    password,
  });

  if (response.status != 201)
    return {
      success: false,
      message:
        response.data.message || "An error occurred during registration.",
      about: response.data.about || "unknown",
    };

  console.log(response.data);
};

export const codeVerify = async (code) => {
  const res = await axios.post("/auth/verify", { code });
  return res;
};

export const loginData = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res;
};

export const loginOut = async () => {
  const res = await api.get("/session/logout");
  return res;
};

export const deleteAccount = async () => {
  const res = await api.delete("/session/account");
  return res;
};

export const forgotPassword = async (email) => {
  const res = await axios.post("/auth/password", { email });
  return res;
};

export const changePassCode = async (code, password) => {
  const res = await axios.post("/auth/password/code", {
    code,
    password,
  });
  return res;
};
