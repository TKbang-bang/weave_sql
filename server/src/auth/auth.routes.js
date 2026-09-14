import { Router } from "express";

import {
  signinController,
  signupController,
  signupVerifyController,
} from "./auth.controllers.js";
import { signupMiddleware } from "./auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signupMiddleware, signupController);
authRoutes.post("/verify", signupVerifyController);
authRoutes.post("/signin", signinController);

export default authRoutes;
