const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    language: {
      type: String,
      enum: ["cpp", "python", "javascript"],
      required: true,
    },

    category: {
      type: String,
      enum: ["books", "links", "articles"],
      required: true,
    },

    type: {
      type: String,
      enum: ["pdf", "link"],
      required: true,
    },

    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (this.type === "link") return !!v;
          return true;
        },
        message: "URL is required for link type",
      },
    },

    filePath: {
      type: String,
      validate: {
        validator: function (v) {
          if (this.type === "pdf") return !!v;
          return true;
        },
        message: "PDF file is required",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lessons", resourceSchema);