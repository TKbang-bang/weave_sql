import ServerError from "../error/server.error.js";
import {
  createMultimediaPost,
  createTextPost,
} from "../helpers/posts.helper.js";

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
