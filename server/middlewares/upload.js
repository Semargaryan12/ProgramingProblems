const multer = require("multer");
const path = require("path");
const fs = require("fs");

const allowedExtensions = [
  ".pdf", ".doc", ".docx",
  ".xls", ".xlsx",
  ".js", ".py", ".cpp", ".c", ".java", ".html", ".css", ".zip",
];

const storage = multer.diskStorage({
  // ... existing code ...
destination: function (req, file, cb) {
    let folderName = "default";
    
    // Log this to see what Multer sees during the "Network Error"
    console.log("Multer processing URL:", req.originalUrl);

    if (req.originalUrl.includes("/answerq")) {
        folderName = "questions";
    } else if (req.originalUrl.includes("/answer")) {
        folderName = "labs";
    } else if (req.originalUrl.includes("/questions") && req.method === "POST") {
        folderName = "hints";
    }

    const finalPath = path.join(__dirname, "..", "uploads", folderName);
    
    // Check if path exists or create it
    if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
    }
    cb(null, finalPath);
},
// ... rest of code ...

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const name = path.parse(file.originalname).name.replace(/\s+/g, "_");
    cb(null, name + "-" + unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Uploading file:", file.originalname);

  const ext = path.extname(file.originalname || "").toLowerCase();

  if (!ext) {
    console.log("No extension detected");
    return cb(new Error("File must have extension"), false);
  }

  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }

  console.log("File rejected by Multer:", ext);
  return cb(new Error("Only allowed code and document files are accepted"), false);
};


module.exports = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

