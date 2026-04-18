// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/Video.css';

import VideoList from "../../components/video/VideoList";

// export default function Videos() {
//      const [videoList, setVideoList] = useState([]);
//      const [selectedVideo, setSelectedVideo] = useState(null);
//      const [volume, setVolume] = useState(1);
   
//      useEffect(() => {
//           try {
//                const response =  axios.get('http://localhost:5000/api/videos/list', { withCredentials: true })
//               setVideoList(response.data) ;
//               console.log(response.data);
//           } catch (error) {
//                console.log(error);      
//           }
//      }, []);
     
//      const handlePlay = () => {
//        document.getElementById('video-player').play();
//      };
   
//      const handlePause = () => {
//        document.getElementById('video-player').pause();
//      };
   
//      const handleVolumeChange = (e) => {
//        const newVolume = parseFloat(e.target.value);
//        setVolume(newVolume);
//        document.getElementById('video-player').volume = newVolume;
//      };
   
//      return (
//        <div className="video-player-app">
//          <h1 className="app-title">🎥 My Secure Video Player</h1>
   
//          <div className="layout">
//            <div className="video-list">
//              <h2>Available Videos</h2>
//              {/* {videoList.length === 0 ? (
//                <p className="no-videos">No videos uploaded yet.</p>
//              ) : (
//                videoList.map(video => (
//                  <div
//                    key={video._id}
//                    className={`video-item ${selectedVideo === video._id ? 'active' : ''}`}
//                    onClick={() => setSelectedVideo(video._id)}
//                  >
//                    {video.title}
//                  </div>
//                ))
//              )} */}
//            </div>
   
//            <div className="video-section">
//              {selectedVideo ? (
//                <div className="video-card">
//                  <video
//                    id="video-player"
//                    controls
//                    controlsList="nodownload"
//                    className="video-element"
//                  >
//                    {/* Video source to stream from server */}
//                    <source src={`http://localhost:5000/api/videos/stream/${selectedVideo}`} type="video/mp4" />
//                    Your browser does not support the video tag.
//                  </video>
   
//                  <div className="controls">
//                    <button onClick={handlePlay}>Play</button>
//                    <button onClick={handlePause}>Pause</button>
   
//                    <label htmlFor="volume">Volume:</label>
//                    <input
//                      id="volume"
//                      type="range"
//                      min="0"
//                      max="1"
//                      step="0.05"
//                      value={volume}
//                      onChange={handleVolumeChange}
//                    />
//                  </div>
//                </div>
//              ) : (
//                <p className="select-prompt">Select a video to play</p>
//              )}
//            </div>
//          </div>
//        </div>
//      );
//    }
   
  export default function Videos() {
     return(
          <VideoList />
     )
}