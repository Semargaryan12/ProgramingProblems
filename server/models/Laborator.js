const mongoose = require('mongoose');

const laboratorSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Laborator', laboratorSchema);
