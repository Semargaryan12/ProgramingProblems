import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './styles/Video.css';
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 const { lang: language } = useContext(LanguageContext);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthorized(true);
      if (parsedUser?.role === "admin") setIsAdmin(true);
    } catch (err) {
      console.error("Error parsing user info:", err);
      setIsAuthorized(false);
    }
  }, [navigate]);

 const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create a 1-second timer promise
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Start the API call
      const apiPromise = api.get(`/videos?language=${language}`);

      // 3. Wait for both the data and the 1s timer to finish
      const [res] = await Promise.all([apiPromise, timer]);

      setVideos(res.data);
      setFilteredVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Չհաջողվեց բեռնել տեսադասերը։ Փորձեք նորից։");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (language) {
    fetchVideos();
  }
}, [language]);

  const deleteVideo = async (id) => {
    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      setFilteredVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Չհաջողվեց հեռացնել տեսադասը։");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredVideos(
      videos.filter((v) =>
        v.title.toLowerCase().includes(query)
      )
    );
  };

  if (loading)
    return (
      <div className="video-page-container spinner-container">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return (
      <div className="video-page-container">
        <p className="error-message">{error}</p>
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="video-page-container">
        <p className="message">
          Խնդրում ենք մուտք գործել՝ տեսադասերը դիտելու համար։
        </p>
      </div>
    );

  return (
    <div className="video-page-container">
      <h2 className="video-page-title">
        Ծրագրավորման տեսադասեր
      </h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Փնտրել դասի վերնագրով..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {filteredVideos.length === 0 ? (
        <p className="message">Տեսադաս չի գտնվել։</p>
      ) : (
        <ul className="video-grid">
          {filteredVideos.map((video) => (
            <li key={video._id} className="video-card">
              <h3 className="video-title">{video.title}</h3>

              <video
                className="video-player"
                controls
                preload="metadata"
              >
                <source
                  src={`http://localhost:5000/api/videos/stream/${video.filename}`}
                  type="video/mp4"
                />
                Ձեր բրաուզերը չի աջակցում տեսադասերի դիտմանը։
              </video>

              {isAdmin && (
                <button
                  className="delete-button"
                  onClick={() => deleteVideo(video._id)}
                >
                  Հեռացնել
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoList;
