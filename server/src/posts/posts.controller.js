import { unlink } from "fs/promises";

import {
  getPostService,
  postService,
  postVideoService,
} from "./posts.service.js";

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

    next(error);
  }
};

export const getPostsController = async (req, res, next) => {
  try {
    const { userID } = req;

    const posts = await getPostService(userID);

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const postVideoController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await postVideoService(Number(id), res, req);
  } catch (error) {
    next(error);
  }
};
