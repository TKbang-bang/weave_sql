import pool from "../db/pool.js";
import ServerError from "../error/server.error.js";

export const createTextPost = async (userID, content) => {
  await pool.query(`INSERT INTO posts (user_id, content) VALUES ($1, $2)`, [
    userID,
    content,
  ]);
};

export const createMultimediaPost = async (
  userID,
  content,
  mediaType,
  fileUrl,
) => {
  const client = await pool.connect();
  try {
    // inserting post data
    const { rows } = await client.query(
      `INSERT INTO posts (user_id, content, type) VALUES ($1, $2, $3) RETURNING id`,
      [userID, content, "multimedia"],
    );

    // getting the post id
    const { id } = rows[0];

    // inserting media data
    await client.query(
      `INSERT INTO media (post_id, type, url) VALUES ($1, $2, $3)`,
      [id, mediaType, fileUrl],
    );
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError) throw error;
    throw new ServerError("Internal server error", "post", 500);
  } finally {
    client.release();
  }
};
