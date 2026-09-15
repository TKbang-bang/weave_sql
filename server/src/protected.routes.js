import { Router } from "express";

import postsRoutes from "./posts/posts.routes.js";

const protectedRouter = Router();

protectedRouter.use("/posts", postsRoutes);

export default protectedRouter;
