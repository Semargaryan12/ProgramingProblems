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
const compilerRoutes = require("./routes/compiler.routes"); // 1. Add this
const path = require("path");
const cookieParser = require("cookie-parser");
dotenv.config();

connecDB();

const app = express();

const client_URL = process.env.client_URL?.replace(/\/$/, "");
console.log(client_URL);
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.client_URL,
].filter(Boolean); // removes undefined

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for: " + origin));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/videos/files", express.static(path.join(__dirname, "videos")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/labs", labsRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/super", superAdmiRoutes);
app.use("/api/compiler", compilerRoutes);

app.use(errorHandler);

module.exports = app;
