const express = require("express");
const multer = require("multer");
const videoController = require("../controllers/videoController.controller");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "videos/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") cb(null, true);
    else cb(new Error("Only mp4 files are allowed"));
  },
});

router.get("/", auth, videoController.getAllVideos);

router.get("/stream/:filename", videoController.streamVideo);

router.post(
  "/upload",
  auth,
  isAdmin,
  upload.single("video"),
  videoController.uploadVideo
);
router.delete("/:id", auth, isAdmin, videoController.deleteVideo);

module.exports = router;
