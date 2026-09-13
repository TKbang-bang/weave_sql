import jwt from "jsonwebtoken";

import ServerError from "../error/server.error.js";
import pool from "../db/pool.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import { cookieOptions } from "../utils/cookies.js";

// creating session middleware to verify access and refresh tokens
const sessionMiddleware = async (req, res, next) => {
  // getting access and refresh tokens from request headers and cookies
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  //   console.log({ accessToken, refreshToken });

  // token verification
  if ((!accessToken || accessToken === "null") && !refreshToken) {
    return next(
      new ServerError("Unauthorized", "No valid tokens provided", 401),
    );
  }

  // if both tokens are present, verify access token first
  if (accessToken && accessToken !== "null") {
    try {
      // verify access token
      const { userID } = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );

      // verify if user id is in db
      const { rows: user } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userID],
      );
      if (user.length === 0) return;

      // if access token is valid, set userId and proceed
      req.userID = userID;

      return next();
    } catch (error) {
      //   console.log("Invalid access token");
    }
  }

  // refresh token verification
  if (refreshToken) {
    try {
      // verify refresh token
      const { userID } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      // verify if user id is in db
      const { rows: user } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userID],
      );
      if (user.length === 0) {
        // clearing cookies
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });

        return next(
          new ServerError("User not found", "User does not exist", 404),
        );
      }

      // create new access and refresh tokens
      const newAccessToken = createAccessToken(userID);
      const newRefreshToken = createRefreshToken(userID);

      // set new tokens in response
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.setHeader("access-token", `Bearer ${newAccessToken}`);
      req.userID = userID;

      return next();
    } catch (error) {
      // console.log("Invalid refresh token");
      return next(
        new ServerError("Unauthorized", "Invalid refresh token", 401),
      );
    }
  }
};

export default sessionMiddleware;
