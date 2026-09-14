import jwt from "jsonwebtoken";

export const createAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userID) => {
  return jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

export const codeToken = (data) => {
  return jwt.sign(data, process.env.CODE_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};
