import React, { useState, useEffect, useRef } from "react";
import { api } from "../../api/api";
import "./styles/CreateVideo.css";

const AdminVideoUploadPage = () => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === "admin") setIsAdmin(true);
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchVideos = async () => {
      try {
        const { data } = await api.get("/videos");
        setUploadedVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetchVideos();
  }, [isAdmin]);

  const handleTitleChange = (e) => setVideoTitle(e.target.value);
  const handleFileChange = (e) => setVideoFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!videoTitle || !videoFile) {
      setMessage({
        text: "Please provide both title and video file.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("video", videoFile);

    setIsLoading(true);
    try {
      const { data } = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedVideos((prev) => [data, ...prev]);
      setMessage({ text: "Video uploaded successfully!", type: "success" });
      setVideoTitle("");
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed", err);
      setMessage({
        text: err.response?.data?.message || "Upload failed.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="dark-video-upload-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to upload videos.</p>
      </div>
    );
  }

  return (
    <div className="dark-video-upload-container">
      <h2>Upload Video</h2>
      <div className="dark-upload-form">
        <div className="form-group">
          <label htmlFor="videoTitle">Video Title:</label>
          <input
            id="videoTitle"
            type="text"
            value={videoTitle}
            onChange={handleTitleChange}
            placeholder="Enter video title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoFile">Video File:</label>
          <input
            id="videoFile"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Video"}
        </button>
        {message.text && (
          <div className={`dark-message ${message.type}`}>{message.text}</div>
        )}
      </div>

      {uploadedVideos.length > 0 && (
        <div className="dark-uploaded-videos">
          <h3>Uploaded Videos</h3>
          <ul>
            {uploadedVideos.map((video) => (
              <li key={video.id || video.url} className="dark-video-item">
                <h4>{video.title}</h4>
                <video width="300" controls>
                  <source
                    src={video.url}
                    type={video.mimeType || "video/mp4"}
                  />
                  Your browser does not support the video tag.
                </video>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminVideoUploadPage;
