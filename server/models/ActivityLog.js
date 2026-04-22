// models/ActivityLog.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", activitySchema);
 