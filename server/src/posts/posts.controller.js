import { unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { postService } from "./posts.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPostsController = async (req, res, next) => {};

export const postsController = async (req, res, next) => {
  try {
    const { content, type, mediaType } = req.body;
    let file = null;
    type == "multimedia" && (file = req.file.filename);
    const { userID } = req;

    await postService(userID, { content, type, mediaType, file });

    res.status(201).json({ message: "Post made successfuly" });
  } catch (error) {
    req.file && (await unlink(`${req.file.path}`));

    return next(error);
  }
};
