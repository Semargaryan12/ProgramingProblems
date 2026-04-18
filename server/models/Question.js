const mongoose = require("mongoose");
const Answer = require("./Answer");
const fs = require("fs");
const path = require("path");

const questionSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ["cpp", "python", "javascript"],
      required: true
    },
    questionText: { type: String, required: true, trim: true },
    subQuestion: { type: String, required: true, trim: true },
    hintUrl: { type: String }
  },
  { timestamps: true }
);

/*
  🔥 Automatically delete:
  - All related answers
  - Uploaded files of answers
*/
questionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const questionId = this.getQuery()._id;

    const answers = await Answer.find({ questionId });

    for (const answer of answers) {
      if (answer.filename) {
        const filePath = path.join(__dirname, "../uploads", answer.filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Answer.deleteMany({ questionId });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Question", questionSchema);