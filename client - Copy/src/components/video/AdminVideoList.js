import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './styles/Video.css';

const AdminVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authorization and role
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

  // Fetch videos from server
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/videos");
      setVideos(res.data);
      setFilteredVideos(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Չհաջողվեց բեռնել տեսադասերը։ Փորձեք նորից։");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Delete video handler
  const deleteVideo = async (id) => {
    if (!window.confirm("Արդյոք ցանկանում եք հեռացնել այս տեսադասը?")) return;

    try {
      await api.delete(`/videos/${id}`);
      setVideos(prev => prev.filter(v => v._id !== id));
      setFilteredVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Չհաջողվեց հեռացնել տեսադասը։");
    }
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredVideos(videos.filter(v => v.title.toLowerCase().includes(query)));
  };

  // Loading state
  if (loading)
    return (
      <div className="video-page-container spinner-container">
        <div className="spinner"></div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="video-page-container">
        <p className="error-message">{error}</p>
      </div>
    );

  // Unauthorized
  if (!isAuthorized || !isAdmin)
    return (
      <div className="video-page-container">
        <p className="message">
          Դուք չունեք հասանելիություն՝ տեսադասերը դիտելու կամ ջնջելու համար։
        </p>
      </div>
    );

  return (
    <div className="video-page-container">
      <h2 className="video-page-title">Ծրագրավորման տեսադասեր (Admin)</h2>

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
          {filteredVideos.map(video => (
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

export default AdminVideoList;