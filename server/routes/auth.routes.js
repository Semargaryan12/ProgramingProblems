const express = require("express");
const { register, login, getSingleUser, logout, getAllUsers, refresh, getMyResults, gradeAnswer, gradeLab, verifyEmail } = require("../controllers/auth.controller");
const { registerValidation,loginValidation } = require("../validation/authValidation");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const { validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Շատ փորձեր, փորձեք հետո"
});


router.post("/register", registerValidation, async (req, res, next) => {
  try {
    await register(req, res, next);
  } catch (error) {
    console.log(error);

    next(error);
  }
});

router.post("/login", loginLimiter, loginValidation, login);


router.get("/user/:id", auth, isAdmin, getSingleUser);

router.get("/users/list", auth, isAdmin, getAllUsers);

router.post("/logout", logout);

router.post("/refresh", refresh);
router.post("/verify-email", verifyEmail);

router.get('/my-profile', auth, getMyResults);

// Ադմինի համար՝ գնահատելու
router.post('/grade-answer', auth, isAdmin, gradeAnswer);
router.post('/grade-lab', auth, isAdmin, gradeLab);

// router.get('/admins', auth, isAdmin, getAllAdmins);
// router.delete('/admin/:id',auth, isAdmin, deleteAdmin);
module.exports = router;


