const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  deleteQuiz,
  updateQuiz,
  solveQuiz,
  getSingleQuiz,
  getAnswersByUserId,
} = require("../controllers/quiz.controller");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const validateQuiz = require("../validation/validateQuiz");

const router = express.Router();

router.post("/create", auth, isAdmin, validateQuiz, createQuiz);

router.get("/all", auth, getAllQuizzes);

router.delete("/delete/:id", auth, isAdmin, deleteQuiz);

router.get("/:id", auth, getSingleQuiz);

router.put("/update/:id", auth, isAdmin, updateQuiz);

router.post("/solve/:id", auth, solveQuiz);

router.get("/quizuser/:userId", getAnswersByUserId);

module.exports = router;
