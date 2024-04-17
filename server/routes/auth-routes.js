const express = require("express");

const authController = require("../controllers/auth-controllers");

const expressValidator = require("../middleware/validate-request");

const validateUtil = require("../utils/validateUtil");

const router = express.Router();

router.post(
  "/signup",
  expressValidator.validateRequest(validateUtil.validateSignupInputs()),
  authController.signup
);

router.post(
  "/login",
  expressValidator.validateRequest(validateUtil.validateLoginInputs()),
  authController.login
);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
