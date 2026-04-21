const Quiz = require("../models/Quiz");
const QuizSubmission = require("../models/QuizSubmission");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const normalizeLanguage = (lang) => {
  if (!lang) return null;

  const value = lang.toLowerCase();

  if (value === "cpp" || value === "c++") return "cpp";
  if (value === "python") return "python";
  if (value === "javascript" || value === "js") return "javascript";

  return null; // ❗ important
};

const getAllQuizzes = async (language) => {
  const normalized = normalizeLanguage(language);

  console.log("INPUT:", language);
  console.log("NORMALIZED:", normalized);

  const filter = normalized ? { language: normalized } : {};

  console.log("FILTER:", filter);

  return Quiz.find(filter).populate("createdBy", "username email");
};

const createQuiz = async (quizData, userId) => {
  try {
    // 1. Ստուգում ենք՝ արդյոք այս լեզվի համար արդեն կա Final թեստ
    if (quizData.isFinal) {
      const existingFinal = await Quiz.findOne({
        language: quizData.language,
        isFinal: true,
      });

      if (existingFinal) {
        // Օգտագործում ենք ApiError բարձր մակարդակի սխալի համար
        throw new ApiError(
          400,
          `${quizData.language} լեզվի համար վերջնական թեստն արդեն գոյություն ունի:`,
        );
      }
    }

    // 2. Ստեղծում ենք թեստը
    const quiz = new Quiz({
      ...quizData,
      createdBy: userId,
    });

    const savedQuiz = await quiz.save();

    console.log("[QuizService] Quiz created successfully:", {
      quizId: savedQuiz._id,
      userId,
    });

    return savedQuiz;
  } catch (error) {
    // Եթե սխալը արդեն ApiError է, ուղղակի վերահասցեագրում ենք
    if (error instanceof ApiError) {
      throw error;
    }

    // Մնացած դեպքերում (օրինակ՝ DB սխալներ) լոգավորում ենք և նետում նոր սխալ
    console.error("[QuizService] Unexpected Error:", error);
    throw new ApiError(
      500,
      "Թեստի ստեղծման ընթացքում տեղի է ունեցել սերվերային սխալ:",
    );
  }
};
const getSingleQuiz = async (quizId) => {
  const quiz = await Quiz.findById(quizId).populate(
    "createdBy",
    "username email",
  );
  if (!quiz) throw new ApiError(404, "Quiz not found");
  return quiz;
};

const deleteQuiz = async (quizId) => {
  const quiz = await Quiz.findByIdAndDelete(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");
  return quiz;
};

const updateQuiz = async (quizId, title) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(quizId, { title }, { new: true });
    if (!quiz) throw ApiError(404, "Quiz not found");
    return quiz;
  } catch (error) {
    console.error(error);
    throw ApiError(500, "Failed to update quiz");
  }
};

const solveQuiz = async (quizId, userAnswers, userId) => {
  const exists = await QuizSubmission.findOne({ quizId, userId });
  if (exists) {
    throw new ApiError(400, "Quiz already solved by this user");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const total = quiz.questions.length;
  const score = quiz.questions.reduce((sum, q, idx) => {
    return (
      sum +
      (q.correctAnswerIndex === userAnswers[idx]?.selectedAnswerIndex ? 1 : 0)
    );
  }, 0);

  const submission = await new QuizSubmission({
    quizId,
    userId,
    answers: quiz.questions.map((q, idx) => ({
      questionId: q._id,
      selectedAnswerIndex: userAnswers[idx]?.selectedAnswerIndex,
    })),
    score,
  }).save();

  await User.findByIdAndUpdate(userId, {
    $push: {
      quizSubmissions: {
        quizId,
        submissionId: submission._id,
        score,
        submittedAt: submission.submittedAt,
      },
    },
  });

  return { score, total };
};

const checkIfAlreadySolved = async (userId, quizId) => {
  const existing = await QuizSubmission.findOne({
    user: userId,
    quiz: quizId,
  });

  return !!existing;
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getSingleQuiz,
  deleteQuiz,
  updateQuiz,
  solveQuiz,
};
