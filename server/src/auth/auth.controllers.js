import { codeCookies, sendingCookies } from "../utils/cookies.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import { signupService, signupVerifyService } from "./auth.service.js";

export const signupController = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const codeToken = await signupService(
      firstname,
      lastname,
      username,
      email,
      password,
    );

    return codeCookies(res, codeToken);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signupVerifyController = async (req, res, next) => {
  try {
    const { code } = req.body;

    const userId = await signupVerifyService(req, code);

    // creating tokens
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    return sendingCookies(
      res,
      accessToken,
      refreshToken,
      "Account created successfuly",
    );
  } catch (error) {
    return next(error);
  }
};
