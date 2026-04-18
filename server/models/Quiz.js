const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
    language: {
        type: String,
        enum: ["cpp", "python", "javascript"],
        required: true
    },
    isFinal: { type: Boolean, default: false },
    questions: [
        {
            text: { type: String, required: true },
            options: {
                type: [String],
                required: true,
                validate: {
                    validator: (v) => v.length >= 2,
                    message: "Each question must have at least two options."
                }
            },
            correctAnswerIndex: { type: Number, required: true }
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
