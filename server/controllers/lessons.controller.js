const Lessons = require("../models/Lessons");
const ApiError = require("../utils/ApiError");

const VALID_LANGUAGES = ["cpp", "python", "javascript"];
const VALID_TYPES = ["pdf", "link"];
const VALID_CATEGORIES = ["books", "links", "articles"];

const createLesson = async (req, res, next) => {
  try {
    const { language, title, category, type, url } = req.body;

    // 🔒 VALIDATION
    if (!language || !VALID_LANGUAGES.includes(language)) {
      return next(new ApiError(400, "Անվավեր լեզու"));
    }

    if (!title || title.trim().length < 3) {
      return next(new ApiError(400, "Վերնագիրը շատ կարճ է"));
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return next(new ApiError(400, "Անվավեր category"));
    }

    if (!VALID_TYPES.includes(type)) {
      return next(new ApiError(400, "Անվավեր type"));
    }

    let resourceData = {
      language,
      title: title.trim(),
      category,
      type,
    };

    if (type === "pdf") {
      if (!req.file) {
        return next(new ApiError(400, "PDF ֆայլը պարտադիր է"));
      }

      resourceData.filePath = `/uploads/${req.file.filename}`;
    }

    if (type === "link") {
      if (!url) {
        return next(new ApiError(400, "Հղումը պարտադիր է"));
      }

      resourceData.url = url.trim();
    }

    const resource = await Lessons.create(resourceData);

    res.status(201).json({
      success: true,
      data: resource,
    });

  } catch (err) {
    console.error("Create lesson error:", err);
    next(new ApiError(500, "Սերվերի սխալ"));
  }
};

const getLessons = async (req, res, next) => {
  try {
    const { language } = req.query;

    // If language is provided, filter; otherwise, fetch everything
    const filter = language ? { language } : {};
    const resources = await Lessons.find(filter).sort({ language: 1 });

    res.json(resources);
  } catch (err) {
    console.error(err);
    next(new ApiError(500, "Սերվերի սխալ"));
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const resource = await Lessons.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true, runValidators: true }
    );

    if (!resource)
      return next(new ApiError(404, "Նյութը չի գտնվել"));

    res.json(resource);
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const resource = await Lessons.findByIdAndDelete(req.params.id);

    if (!resource)
      return next(new ApiError(404, "Նյութը չի գտնվել"));

    res.json({ message: "Ջնջված է" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createLesson, getLessons, updateLesson, deleteLesson };

