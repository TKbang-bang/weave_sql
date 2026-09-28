import React from "react";

function VideoPlayer({ id }) {
  return (
    <div className="video_player">
      <video controls onLoad="lazy">
        <source src={`${import.meta.env.VITE_SERVER_URL}/video/${id}`} />
      </video>
    </div>
  );
}

export default VideoPlayer;
