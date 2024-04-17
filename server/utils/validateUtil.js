const { check } = require("express-validator");

const validateSignupInputs = () => [
  check("Email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  check("Password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("BusinessName")
    .matches(/^[a-zA-Z0-9 ,\-]+$/)
    .withMessage("Business Name must contain only letters and numbers"),

  check("Country").not().isEmpty().withMessage("Country cannot be empty"),
];

const validateLoginInputs = () => [
  check("Email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  check("Password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateSignupInputs = validateSignupInputs;
exports.validateLoginInputs = validateLoginInputs;
