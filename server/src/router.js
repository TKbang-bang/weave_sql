import { Router } from "express";

import authRoutes from "./auth/auth.routes.js";
import protectedRouter from "./protected.routes.js";
import sessionMiddleware from "./middlewares/session.handler.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/protected", sessionMiddleware, protectedRouter);

export default router;
