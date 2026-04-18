const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["cpp", "python", "javascript"],
    required: true,
  },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", videoSchema);