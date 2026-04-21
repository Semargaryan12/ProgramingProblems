const fs = require("fs");
const path = require("path");
const Video = require("../models/videoModel");

const normalizeLanguage = (lang) => {
  if (!lang) return null;

  const value = lang.toLowerCase();

  if (value === "c++" || value === "cpp") return "cpp";
  if (value === "python") return "python";
  if (value === "javascript" || value === "js") return "javascript";

  return null;
};

const streamVideo = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "videos", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

const getAllVideos = async (req, res) => {
  try {
    const { language } = req.query;

    const filter = language ? { language } : {};

    const videos = await Video.find(filter);

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const filePath = path.join(__dirname, "..", video.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const { language, title } = req.body;
    const file = req.file;

    if (!file)
      return res.status(400).json({ message: "No video file uploaded" });

    const normalizedLang = normalizeLanguage(language);

    if (!normalizedLang) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const newVideo = new Video({
      language: normalizedLang, // ✅ FIXED
      title,
      filename: file.filename,
      path: `videos/${file.filename}`,
    });

    await newVideo.save();

    res.status(201).json({ message: "Video uploaded", video: newVideo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

module.exports = {
  streamVideo,
  getAllVideos,
  deleteVideo,
  uploadVideo,
};
