import { Router } from "express";

import authRoutes from "./auth/auth.routes.js";
import protectedRouter from "./protected.routes.js";
import sessionMiddleware from "./middlewares/session.handler.js";
import { postVideoController } from "./posts/posts.controller.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/protected", sessionMiddleware, protectedRouter);
router.get("/video/:id", postVideoController);

export default router;
