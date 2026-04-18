const mongoose = require("mongoose");
const laboratorAnswerSchema = new mongoose.Schema({
  laboratorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laborator' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  grade: { type: Number, default: 0 }, // Ադմինի կողմից տրվող գնահատականը
  submittedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('LaboratorAnswer', laboratorAnswerSchema);