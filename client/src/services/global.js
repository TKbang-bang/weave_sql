import axios from "axios";
import api from "./api.service";
import { getAccessToken, setAccessToken } from "./token.service";

export const isUserLogged = async () => {
  const token = getAccessToken();

  const response = await axios.get("/protected/session", {
    withCredentials: true,
    headers: { Authorization: token ? `Bearer ${token}` : null },
  });

  if (response.status != 201) return { success: false };

  if (response.headers["access-token"])
    setAccessToken(response.headers["access-token"]);

  return { success: true };
};
