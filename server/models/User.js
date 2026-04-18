const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, minlength: 2 },
  surname: { type: String, required: true, minlength: 2 },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /.+\@.+\..+/
  },
  password: { type: String, required: true, minlength: 6 },

  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
 verificationCode: { type: String },
 verificationExpires: { type: Date },

  questionAnswers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
      submittedAt: { type: Date, default: Date.now }
    }
  ],

  quizSubmissions: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizSubmission' },
      score: { type: Number, required: true },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  labSubmissions: [
    {
      labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laborator' },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LaboratorAnswer' },
      submittedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
