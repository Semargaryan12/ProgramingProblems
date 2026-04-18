const Resource = require("../models/Resource.js");
const ApiError = require("../utils/ApiError.js");
const VALID_LANGUAGES = ["cpp", "python", "javascript"];

const createResource = async (req, res, next) => {
  try {
    const { language, title, category, type, url } = req.body;
     if (!language || !VALID_LANGUAGES.includes(language)) {
      return next(new ApiError(400, "Անվավեր լեզու"));
    }

    let resourceData = {
      language,
      title,
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

      resourceData.url = url;
    }

    const resource = await Resource.create(resourceData);

    res.status(201).json(resource);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getRes = async (req, res, next) => {
  try {
    const { language } = req.query;
    
    // If language is provided, filter by it. Otherwise, get all.
    const query = language ? { language } : {};
    const resources = await Resource.find(query).sort({ language: 1 });
    
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
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

const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource)
      return next(new ApiError(404, "Նյութը չի գտնվել"));

    res.json({ message: "Ջնջված է" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createResource, getRes, updateResource, deleteResource };

