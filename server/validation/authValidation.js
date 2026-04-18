const { body } = require("express-validator");

exports.registerValidation = [
  body("name").notEmpty().isLength({ min: 2 }),
  body("surname").notEmpty().isLength({ min: 2 }),

  body("username")
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .toLowerCase(),

  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
];

exports.loginValidation = [
  body("identifier").notEmpty(),
  body("password").notEmpty()
];