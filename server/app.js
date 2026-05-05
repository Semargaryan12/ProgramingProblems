const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connecDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const videoRoutes = require("./routes/videoRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resourceRoutes = require("./routes/resource.routes.js");
const { errorHandler } = require("./middlewares/error.middleware.js");
const labsRoutes = require("./routes/labsRoutes");
const lessonsRoutes = require("./routes/lessons.router.js");
const superAdmiRoutes = require("./routes/superAdmin.routes.js");
const compilerRoutes = require("./routes/compiler.routes");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();
connecDB();

const app = express();

app.set("trust proxy", 1);

// ✅ CORS (simplified for production)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folders (uploads, videos)
app.use("/videos/files", express.static(path.join(__dirname, "videos")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/labs", labsRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/super", superAdmiRoutes);
app.use("/api/compiler", compilerRoutes);

// ✅ Serve React ONLY in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client", "build");

  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// ✅ Health check (very useful for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error handler (must be last)
app.use(errorHandler);

module.exports = app;