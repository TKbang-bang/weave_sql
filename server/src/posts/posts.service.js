import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../db/pool.js";
import ServerError from "../error/server.error.js";
import {
  createMultimediaPost,
  createTextPost,
} from "../helpers/posts.helper.js";
import myDate from "../utils/date_format.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const postService = async (userID, postData) => {
  const { content, type, mediaType, file } = postData;

  if (type == "text") {
    await createTextPost(userID, content);
  } else if (type == "multimedia") {
    if (mediaType != "image" && mediaType != "video")
      throw new ServerError("Invalid media type", "media type", 409);

    await createMultimediaPost(userID, content, mediaType, file);
  } else {
    throw new ServerError("Invalid post type", "post type", 409);
  }
};

export const getPostService = async (userID) => {
  const { rows } = await pool.query(
    `
      WITH allPosts AS (
        SELECT
          p.id AS post_id,
          p.type AS post_type,
          p.content,
          p.created_at,
          p.deleted_at,
          m.id AS media_id,
          m.type AS media_type,
          m.url,
          u.id AS user_id,
          u.firstname,
          u.lastname,
          u.username,
          u.avatar
        FROM posts p LEFT JOIN media m
          ON p.id = m.post_id
        LEFT JOIN users u ON p.user_id = u.id
      )

      SELECT
        ap.*,
        EXISTS (
          SELECT 1 FROM follows
          WHERE following_id = ap.user_id AND follower_id = $1
        ) as is_following,
        EXISTS (
          SELECT 1 FROM likes
          WHERE user_id = $1 AND post_id = ap.post_id
        ) AS liked,
        EXISTS (
          SELECT 1 FROM saved_posts
          WHERE user_id = $1 AND post_id = ap.post_id
        ) AS saved,
        EXISTS (
          SELECT 1 WHERE ap.user_id = $1
        ) AS is_me,
        (SELECT COUNT(*) FROM likes WHERE post_id = ap.post_id) AS likes,
        (SELECT COUNT(*) FROM comments WHERE post_id = ap.post_id) AS comments
      FROM allPosts ap ;
    `,
    [userID],
  );

  const sanitizedPosts = rows.map((each) => {
    return {
      id: each.post_id,
      type: each.post_type,
      content: each.content,
      created_at: each.created_at,
      deleted_at: each.deleted_at,
      likes: Number(each.likes),
      comments: Number(each.comments),
      liked: each.liked,
      saved: each.saved,
      since_date: myDate(each.created_at),
      media: each.post_type == "multimedia" && {
        id: each.media_id,
        type: each.media_type,
        url: each.url,
      },
      owner: {
        id: each.user_id,
        firstname: each.firstname,
        lastname: each.lastname,
        username: each.username,
        avatar: each.avatar,
        isFollowing: each.is_following,
        isMe: each.is_me,
      },
    };
  });

  return sanitizedPosts;
};

export const postVideoService = async (id, res, req) => {
  // verify if the video is in db
  const { rows } = await pool.query(
    `SELECT url FROM media WHERE id = $1 AND type = 'video'`,
    [id],
  );
  if (!rows[0])
    throw new ServerError("No such file on such directory", "video", 404);

  const filePath = path.join(__dirname, `../../public/videos/${rows[0].url}`);

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (range) {
    const [startString, endString] = range.replace(/bytes=/, "").split("-");

    const start = Number(startString);
    const end = endString ? Number(endString) : fileSize - 1;

    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });

    const header = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": `video/mp4`,
    };

    res.writeHead(206, header);

    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "content-length": fileSize,
      "content-type": `video/mp4`,
    });

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
  }
};
