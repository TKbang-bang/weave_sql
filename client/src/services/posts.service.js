import api from "./api.service";

export const gettingPosts = async ({ link }) => {
  const response = await api.get(`${link}`);

  if (response.status != 200)
    return {
      success: false,
      message: response.data.message,
    };

  return { success: true, posts: response.data.posts };
};

export const postingPost = async ({ file, content, type, mediaType }) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("type", type);
  formData.append("mediaType", mediaType);
  formData.append("file", file);

  const response = await api.post("/posts", formData);

  if (response.status != 201)
    return {
      success: false,
      message: response.data.message,
    };

  return { success: true, message: response.data.message };
};

export const gettingComments = async (id) => {
  const res = await api.get(`/posts/${id}/comments`);
  return res;
};

export const deletePost = async (post_id) => {
  const res = await api.delete(`/posts/${post_id}`);
  return res;
};
