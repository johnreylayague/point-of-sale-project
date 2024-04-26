const express = require("express");
const authController = require("../controllers/bo-auth-controllers");
const expressValidatorMW = require("../middleware/validate-request");
const expressValidatorUtil = require("../utils/bo-auth-express-validator");

const router = express.Router();

router.post(
  "/signup",
  expressValidatorMW.validateRequest(expressValidatorUtil.signupForm()),
  authController.signup
);

router.post(
  "/login",
  expressValidatorMW.validateRequest(expressValidatorUtil.loginForm()),
  authController.login
);

router.post(
  "/forgotPassword",
  expressValidatorMW.validateRequest(expressValidatorUtil.forgotPasswordForm()),
  authController.forgotPassword
);

router.post(
  "/resetPassword/:token",
  expressValidatorMW.validateRequest(expressValidatorUtil.resetPasswordForm()),
  authController.resetPassword
);

module.exports = router;
