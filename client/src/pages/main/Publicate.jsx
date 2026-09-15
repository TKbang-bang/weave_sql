import React, { useState } from "react";
import { Image, Trash, Video } from "../../components/svg";
import { toast } from "sonner";
import { postingPost } from "../../services/posts.service";

function Publicate() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [mediaType, setMediaType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !content) return

    try {
      const res = await postingPost({ file, content, type, mediaType });
      if (!res.success) throw new Error(res.message);

      toast.success(res.message);

      setFile(null);
      setContent("");
      setType("");
      setMediaType("");

      document.getElementById("images_input").value = "";
      document.getElementById("videos_input").value = "";
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setType("multimedia");
      setMediaType("image");
    }
  };

  const handleChangeVideo = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setType("multimedia");
      setMediaType("video");
    }
  };

  const handleDelete = () => {
    setFile(null);
    setType("text");
    setMediaType(null);
    document.getElementById("images_input").value = "";
    document.getElementById("videos_input").value = "";
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  };

  return (
    <section className="publicate">
      <form onSubmit={handleSubmit}>
        <h1>Publicate</h1>

        {/* <input
          type="text"
          placeholder="Write something..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        /> */}

        <textarea
          placeholder="Write something..."
          maxLength={1000}
          value={content}
          onInput={handleInput}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="file_container">
          {file && (
            <>
              {file.type.includes("image") ? (
                <img src={URL.createObjectURL(file)} alt="file" />
              ) : (
                <video src={URL.createObjectURL(file)} controls />
              )}
            </>
          )}
        </div>

        <div className="btns">
          <input
            type="file"
            id="images_input"
            accept="image/*"
            onChange={handleChangeImage}
          />
          <input
            type="file"
            id="videos_input"
            accept="video/*"
            onChange={handleChangeVideo}
          />
          <label htmlFor="images_input" className="img">
            <Image />
          </label>
          <label htmlFor="videos_input" className="video">
            <Video />
          </label>

          {file && (
            <span onClick={handleDelete} className="del">
              <Trash />
            </span>
          )}
        </div>

        {/* {file && (
          <span onClick={handleDelete} className="del">
            Delete File <Trash />
          </span>
        )} */}

        <button type="submit" className="btn">
          Publicate
        </button>
      </form>
    </section>
  );
}

export default Publicate;
