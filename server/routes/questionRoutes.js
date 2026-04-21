const express = require("express");
const router = express.Router();
const controller = require("../controllers/questionController.controller");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");

// Admin Routes
router.post(
  "/",
  auth,
  isAdmin,
  upload.single("hintFile"),
  controller.createQuestion,
);

router.put("/:id", auth, isAdmin, controller.updateQuestion);

router.delete("/:id", auth, isAdmin, controller.deleteQuestion);

// Public Routes
router.get("/", auth, controller.getQuestions);

router.get("/:id", auth, controller.getQuestion);

router.post(
  "/:id/answerq",
  auth,
  upload.single("file"),
  controller.submitAnswer,
);

// Admin Routes

router.get("/qanswer/:id", auth, controller.questionsAnswer);

router.get("/userq/:userId", controller.getAnswersByUserId);

module.exports = router;
