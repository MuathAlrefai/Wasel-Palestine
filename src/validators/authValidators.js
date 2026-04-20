const { body } = require("express-validator");

const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("fullName is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("fullName must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("password must be between 6 and 100 characters"),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("password is required"),
];

const refreshValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshToken is required")
    .isString()
    .withMessage("refreshToken must be a string"),
];

const logoutValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshToken is required")
    .isString()
    .withMessage("refreshToken must be a string"),
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshValidator,
  logoutValidator,
};
