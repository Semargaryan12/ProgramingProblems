const express = require("express");
const router = express.Router();
const {
  createLaborator,
  getAllLaborators,
  getLaborator,
  updateLaborator,
  deleteLaborator,
  submitAnswer,
  getAnswersByUserId,
} = require("../controllers/labsController.controller");

const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");

// Admin Routes
router.post("/", auth, isAdmin, createLaborator);

router.put("/:id", auth, isAdmin, updateLaborator);

router.delete("/:id", auth, isAdmin, deleteLaborator);

// Public Routes
router.get("/", auth, getAllLaborators);

router.get("/:id", auth, getLaborator);

router.post("/:id/answer", auth, upload.single("file"), submitAnswer);

router.get("/user/:userId", getAnswersByUserId);

module.exports = router;
