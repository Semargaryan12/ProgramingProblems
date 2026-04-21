const User = require("../models/User");
const Answer = require("../models/Answer");
const LaboratorAnswer = require("../models/LaboratorAnswer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
const {
  successResponse,
  createdResponse,
  errorResponse,
} = require("../utils/responses");
require("dotenv").config();
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/tokenService");
const { json } = require("express");

const register = async (req, res, next) => {
  try {
    const { name, surname, username, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Օգտատերը արդեն գոյություն ունի",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const newUser = await User.create({
      name,
      surname,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode: hashedOTP,
      verificationExpires: Date.now() + 3600000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Հաստատում",
      html: `<p>Կոդ: <b>${otp}</b></p>`,
    });

    res.status(201).json({
      message: "Ստուգեք Ձեր էլ. հասցեն",
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.verificationCode) {
      return res.status(400).json({ error: "Սխալ կոդ" });
    }

    const isValid = await bcrypt.compare(
      code.toString(),
      user.verificationCode,
    );

    if (!isValid || user.verificationExpires < Date.now()) {
      return res.status(400).json({ error: "Ժամկետանց կամ սխալ կոդ" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;

    await user.save();

    res.json({ message: "Հաստատվեց" });
  } catch (err) {
    res.status(500).json({ error: "Սխալ" });
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const normalized = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ email: normalized }, { username: normalized }],
    });

    // Prevent timing attack
    const fakeHash =
      "$2a$10$1234567890123456789012uQeH9y9G6sF9l1l1l1l1l1l1l1l1l1l";

    const isMatch = await bcrypt.compare(
      password,
      user ? user.password : fakeHash,
    );

    if (!user || !isMatch) {
      return res.status(401).json({
        error: "Սխալ տվյալներ",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Խնդրում ենք հաստատել էլ․ հասցեն",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    // Security check: Match token against DB
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true });
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    return successResponse(res, "Users found succesfully", users);
  } catch (error) {
    console.log(error);

    return errorResponse(res, error.message);
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User found successfully", user);
  } catch (error) {
    console.log(error);
    return errorResponse(res, error.message, 500);
  }
};

const getMyResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const userWithData = await User.findById(userId)
      .select("-password -refreshToken")
      .populate({
        path: "questionAnswers.questionId",
        model: "Question", // Հստակ նշում ենք մոդելի անունը
      })
      .populate({
        path: "questionAnswers.answerId",
        model: "Answer",
      })
      .populate({
        path: "quizSubmissions.quizId",
        model: "Quiz",
      })
      .populate({
        path: "labSubmissions.labId",
        model: "Laborator",
      })
      .populate({
        path: "labSubmissions.submissionId",
        model: "LaboratorAnswer",
      });

    if (!userWithData) {
      return res.status(404).json({ message: "Օգտատերը չի գտնվել" });
    }

    res.status(200).json({ success: true, data: userWithData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const gradeAnswer = async (req, res) => {
  try {
    const { answerId, grade } = req.body;

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { grade: grade },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Գնահատականը հաջողությամբ տեղադրվեց", updatedAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gradeLab = async (req, res) => {
  try {
    const { answerId, grade } = req.body;

    const updatedAnswer = await LaboratorAnswer.findByIdAndUpdate(
      answerId,
      { grade: grade },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Գնահատականը հաջողությամբ տեղադրվեց", updatedAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  refresh,
  logout,
  getAllUsers,
  getSingleUser,
  getMyResults,
  gradeAnswer,
  gradeLab,
  verifyEmail,
};
