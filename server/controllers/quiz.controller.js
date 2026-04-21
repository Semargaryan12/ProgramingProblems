const quizService = require("../services/quizService");
const ApiError = require("../utils/ApiError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const {
  successResponse,
  createdResponse,
  errorResponse,
} = require("../utils/responses");
const QuizSubmission = require("../models/QuizSubmission");
const mongoose = require("mongoose");
const User = require("../models/User");

const getAllQuizzes = asyncWrapper(async (req, res) => {
  const { language } = req.query; // ✅ get from URL

  const quizzes = await quizService.getAllQuizzes(language); // ✅ pass it

  return successResponse(res, "Quizzes retrieved successfully", quizzes);
});

const createQuiz = asyncWrapper(async (req, res) => {
  // Service-ը կա՛մ կվերադարձնի quiz, կա՛մ կնետի ApiError
  const quiz = await quizService.createQuiz(req.body, req.user.id);

  // Եթե ամեն ինչ լավ է, ուղարկում ենք հաջողված պատասխան
  return createdResponse(res, "Թեստը հաջողությամբ ստեղծվեց:", quiz);
});

const getSingleQuiz = asyncWrapper(async (req, res) => {
  const quiz = await quizService.getSingleQuiz(req.params.id);
  return successResponse(res, "Quiz retrieved successfully", quiz);
});

const deleteQuiz = asyncWrapper(async (req, res) => {
  const quizId = req.params.id;

  // 1️⃣ Validate ID (optional but recommended)
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ message: "Invalid quiz ID" });
  }

  // 2️⃣ Get all submissions related to this quiz
  const submissions = await QuizSubmission.find({ quizId });
  const submissionIds = submissions.map((s) => s._id);

  // 3️⃣ Delete QuizSubmission documents
  await QuizSubmission.deleteMany({ quizId });

  // 4️⃣ Remove quizSubmissions from ALL users
  await User.updateMany(
    {},
    {
      $pull: {
        quizSubmissions: {
          $or: [{ quizId: quizId }, { submissionId: { $in: submissionIds } }],
        },
      },
    },
  );

  // 5️⃣ Delete quiz itself (use service if you prefer)
  await quizService.deleteQuiz(quizId);

  return successResponse(res, "Quiz and related data deleted successfully");
});

const updateQuiz = asyncWrapper(async (req, res) => {
  await quizService.updateQuiz(req.params.id, req.body.title);

  return successResponse(res, "Quiz updated successfully");
});

const solveQuiz = asyncWrapper(async (req, res) => {
  const result = await quizService.solveQuiz(
    req.params.id,
    req.body.answers,
    req.user.id,
  );
  return successResponse(
    res,
    `You scored ${result.score}/${result.total}`,
    result,
  );
});

const getAnswersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    //  const answers = await QuizSubmission.find({ userId })
    // .populate({
    //   path: "quizId",
    //   select: "title questions",
    //   populate: {
    //     path: "questions",
    //     select: "text choices",
    //   },
    // })
    // .exec();

    const answers = await QuizSubmission.find({ userId })
      .populate("quizId", "title questions")
      .lean();

    const formattedAnswers = answers
      .filter((ans) => ans.quizId)
      .map((ans) => ({
        _id: ans._id,
        submittedAt: ans.submittedAt,
        score: ans.score,
        from: ans.quizId.questions?.length || 0,
        quizTitle: ans.quizId.title,
      }));
    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Սխալ պատասխանների բեռնում" });
  }
};

const notFound = (req, res, next) => {
  next(new ApiError(404, "Resource not found"));
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getSingleQuiz,
  deleteQuiz,
  updateQuiz,
  solveQuiz,
  getAnswersByUserId,
  notFound,
};
