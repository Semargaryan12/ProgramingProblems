const mongoose = require("mongoose");
const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String },
  grade: { type: Number, default: 0 } // Ադմինի կողմից տրվող գնահատականը
}, { timestamps: true });

 module.exports = mongoose.model("Answer", answerSchema);