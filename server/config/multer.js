const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError.js");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new ApiError(400, "Only PDF files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = { upload };
