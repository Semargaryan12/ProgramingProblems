const Question = require("../models/Question");
const Answer = require("../models/Answer");
const User = require("../models/User");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");

const VALID_LANGUAGES = ["cpp", "python", "javascript"];

const getQuestions = async (req, res) => {
  try {
    const { language } = req.query;

    let filter = {};

    // If language provided → filter
    if (language) {
      if (!VALID_LANGUAGES.includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language",
        });
      }
      filter.language = language;
    }

    const questions = await Question.find(filter);

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Ստեղծել նոր առաջադրանք
const createQuestion = async (req, res) => {
  try {
    const { language, questionText, subQuestion } = req.body;

    if (!language || !questionText || !subQuestion) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let hintUrl = "";
    if (req.file) {
      // Constructing full URL
      const protocol = req.protocol;
      const host = req.get("host");
      hintUrl = `${protocol}://${host}/uploads/hints/${req.file.filename}`;
    }

    const newQuestion = await Question.create({
      language,
      questionText,
      subQuestion,
      hintUrl // Saved to DB
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, subQuestion } = req.body; // Destructure first

    const updated = await Question.findByIdAndUpdate(
      id,
      { questionText, subQuestion }, // Pass as ONE object
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    // 1️⃣ Find question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2️⃣ Get all related answers
    const answers = await Answer.find({ questionId: id });
    const answerIds = answers.map(a => a._id);

    // 3️⃣ Delete files from uploads folder
    for (const answer of answers) {
      if (answer.filename) {
        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          "questions",
          answer.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // 4️⃣ Delete answers from DB
    await Answer.deleteMany({ questionId: id });

    // 5️⃣ Remove related questionAnswers from ALL users
    await User.updateMany(
      {},
      {
        $pull: {
          questionAnswers: {
            $or: [
              { questionId: id },
              { answerId: { $in: answerIds } }
            ]
          }
        }
      }
    );

    // 6️⃣ Delete question
    await Question.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Question, answers, files, and user references deleted successfully",
    });

  } catch (error) {
    console.error("Delete Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ text: question.questionText,
      createdAt: question.createdAt
    });
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const questionsAnswer = async (req, res) => {
  const answerId = req.params.id;
  try {
    const answer = await Answer.findById(answerId);
    
    res.status(200).json({ message: answer.filename, date: answer.submittedAt });
  } catch (error) {
    console.log(error);
  }
};

const submitAnswer = async (req, res) => {
  try {
    console.log("STEP 1");

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const questionId = req.params.id;

    console.log("STEP 2");

    let question;
    try {
      question = await Question.findById(questionId).lean();
    } catch (dbErr) {
      console.error("💥 FIND ERROR:", dbErr);
      return res.status(500).json({ message: "DB error" });
    }

    console.log("STEP 3");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const existingAnswer = await Answer.findOne({ questionId, userId });
    if (existingAnswer) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const newAnswer = await Answer.create({
      questionId,
      userId,
      filename: req.file.filename
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        questionAnswers: {
          questionId,
          answerId: newAnswer._id
        }
      }
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("🔥 FINAL ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

const getAnswersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const answers = await Answer.find({ userId })
    .populate("questionId", "questionText")
    .exec();
  
  
    
    const formattedAnswers = answers.map((ans) => ({
      _id: ans._id,
      submittedAt: ans.submittedAt,
      filename: ans.filename,
      question: ans.questionId?.questionText || "Անհայտ լաբորատոր",
      excelUrl: `/uploads/questions/${ans.filename}`,
    }));
 console.log(formattedAnswers);
 
    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Սխալ լաբ. պատասխանների բեռնումում" });
  }
};

module.exports = {
  createQuestion, updateQuestion, deleteQuestion, getQuestions, getQuestion, questionsAnswer, submitAnswer, getAnswersByUserId
}