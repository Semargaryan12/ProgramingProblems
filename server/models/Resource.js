const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
       language: {
      type: String,
      enum: ["cpp", "python", "javascript"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Վերնագիրը պարտադիր է"],
      trim: true,
      minlength: [3, "Վերնագիրը պետք է լինի առնվազն 3 նիշ"],
      maxlength: [200, "Վերնագիրը շատ երկար է"],
    },

    url: {
      type: String,
      required: function () {
        return this.type === "link"; // Պարտադիր միայն link-ի համար
      },
      trim: true,
    },

    filePath: {
      type: String,
      required: function () {
        return this.type === "pdf"; // Պարտադիր միայն PDF-ի համար
      },
    },

    category: {
      type: String,
      enum: {
        values: ["books", "links", "articles"],
        message: "Սխալ բաժին",
      },
      required: true,
    },

    type: {
      type: String,
      enum: {
        values: ["pdf", "link"],
        message: "Սխալ նյութի տեսակ",
      },
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
