import { Router } from "express";

import { signupController } from "./auth.controllers.js";
import { signupMiddleware } from "./auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signupMiddleware, signupController);

export default authRoutes;
