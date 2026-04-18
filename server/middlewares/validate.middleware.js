const ApiError = require("../utils/ApiError.js");

const validateResource = (req, _, next) => {
  const { language, title, category, type, url } = req.body;
  if (!language || language.trim().length < 3)
    return next(new ApiError(400, "Language is invalid or too short"));

  if (!title || title.trim().length < 3)
    return next(new ApiError(400, "Title is invalid or too short"));

  if (!["books", "links", "articles"].includes(category))
    return next(new ApiError(400, "Invalid category"));

  if (!["pdf", "link"].includes(type))
    return next(new ApiError(400, "Invalid resource type"));

  // PDF ֆայլի validation
  if (type === "pdf" && !req.file)
    return next(new ApiError(400, "PDF file is required"));

  // Link validation
  if (type === "url" && (!url || !url.trim()))
    return next(new ApiError(400, "URL is required for link type"));

  next();
};



const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "validation_error",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = { validateResource, };
