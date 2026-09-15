import { Router } from "express";

import { getPostsController, postsController } from "./posts.controller.js";
import upload from "../utils/multer.js";
import processImage from "../utils/sharp.js";

const postsRoutes = Router();

postsRoutes.post("/", upload.single("file"), processImage, postsController);
postsRoutes.get("/", getPostsController);
// postsRoutes.get("/:postId/comments", gettingComments);
// // postsRoutes.get("/post/:post_id", getPostsById);
// postsRoutes.get("/me", gettingMyUserPosts);
// postsRoutes.get("/user/:user_id", gettingUserPosts);
// postsRoutes.get("/saved", gettingSavedPosts);
// postsRoutes.delete("/:post_id", deletingPost);

export default postsRoutes;
