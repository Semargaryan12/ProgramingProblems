const express = require("express");
const { createLesson, getLessons, updateLesson, deleteLesson } = require("../controllers/lessons.controller.js");
const { upload } = require("../config/multer.js");
const { validateResource } = require("../middlewares/validate.middleware.js");

const router = express.Router();

router.get("/", getLessons);
router.post("/", upload.single("file"), validateResource, createLesson);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

module.exports = router;
