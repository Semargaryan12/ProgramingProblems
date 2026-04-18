const express = require("express");
const router = express.Router();
const { executeCode } = require("../controllers/compiler.controller");
// Optional: Import your protect middleware if you want only logged-in users to run code
// const { protect } = require("../middlewares/auth.middleware");

router.post("/execute", executeCode);

module.exports = router;