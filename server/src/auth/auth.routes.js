import { Router } from "express";

import {
  isUserLogged,
  signinController,
  signupController,
  signupVerifyController,
} from "./auth.controllers.js";
import { signupMiddleware } from "./auth.middleware.js";
import sessionMiddleware from "../middlewares/session.handler.js";

const authRoutes = Router();

authRoutes.post("/signup", signupMiddleware, signupController);
authRoutes.post("/verify", signupVerifyController);
authRoutes.post("/signin", signinController);
authRoutes.get("/session", sessionMiddleware, isUserLogged);

export default authRoutes;
