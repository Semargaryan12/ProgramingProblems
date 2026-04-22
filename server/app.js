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

// ✅ Must be set before any middleware
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((o) => o.replace(/\/$/, "")); // normalize trailing slashes

console.log("Allowed origins:", allowedOrigins);

// ✅ CORS must come before cookieParser and routes
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server / curl / Postman (no origin)
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }

      console.warn("CORS blocked for origin:", origin);
      return callback(new Error("CORS blocked for: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ Handle preflight for all routes explicitly
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/videos/files", express.static(path.join(__dirname, "videos")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
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
