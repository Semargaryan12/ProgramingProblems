import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import "./styles/Video.css";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "../../constants/languages";

const VideoUpload = () => {
  const [lang, setLang] = useState(null);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.role === "admin") {
          setIsAuthorized(true);
        }
      } catch (err) {
        navigate("/unauthorized");
        console.log("Error parsing user from localStorage:", err);
      }
    }
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!lang || !title || !videoFile) {
      return setMessage("Խնդրում ենք մուտքագրել բոլոր դաշտերը");
    }

    const formData = new FormData();
    formData.append("language", lang);
    formData.append("title", title);
    formData.append("video", videoFile);

    try {
      localStorage.getItem("accessToken");
      await api.post("/videos/upload", formData);
      setMessage("Տեսադասը հաջողությամբ տեղադրվեց");
      setLang("");
      setTitle("");
      setVideoFile(null);
    } catch (err) {
      console.log(err);
      setMessage("Տեսադասի տեղադրումը ձախողվեց");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="video-upload-container">
        <p className="message">Տեսադաս կարող է տեղադրել միյայն ադմինը։</p>
      </div>
    );
  }

  return (
    <div className="video-upload-container">
      <h2>Տեղադրել տեսադաս</h2>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="">Ընտրել լեզուն</option>
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Վերնագիր"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button type="submit">ՏԵղադրել</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default VideoUpload;
