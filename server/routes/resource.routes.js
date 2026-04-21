const express = require("express");
const {
  createResource,
  getRes,
  updateResource,
  deleteResource,
} = require("../controllers/resource.controller.js");
const { upload } = require("../config/multer.js");
const { validateResource } = require("../middlewares/validate.middleware.js");

const router = express.Router();

router.get("/", getRes);
router.post("/", upload.single("file"), validateResource, createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

module.exports = router;
