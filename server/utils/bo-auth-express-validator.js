const { check, param, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const bycryptUtil = require("./bycryptUtil");
const validateUtil = require("./validateUtil");
const tokenModel = require("../models/token");
const userModel = require("../models/user");
const userLogModel = require("../models/userLog");
const hardwareInfoUtil = require("../utils/hardwareInformationUtil");
const os = require("os");

const loginForm = () => [
  check("Email")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { path }) => "Please provide a valid email address")
    .bail()
    .custom(async (value, { req, path }) => {
      const { Email, Password } = req.body;

      try {
        existingUser = await userModel.findOne({ Email: value });
      } catch (err) {
        throw new Error(err);
      }

      if (!existingUser) {
        const createUserLog = new userLogModel();

        try {
          const localIpAddress = await hardwareInfoUtil.getLocalIpAddress();
          const publicIpAddress = await hardwareInfoUtil.getPublicIpAddress();
          const computerName = await hardwareInfoUtil.getComputerName();
          const computerUsername = os.userInfo().username;
          const motherboardSerialNumber =
            await hardwareInfoUtil.getMotherboardSerialNumber();

          createUserLog.Email = Email;
          createUserLog.Password = Password;
          createUserLog.Result = `${path} does not exist.`;
          createUserLog.LocalIpAddress = localIpAddress;
          createUserLog.PublicIpAddress = publicIpAddress;
          createUserLog.ComputerName = computerName;
          createUserLog.SystemUsername = computerUsername;
          createUserLog.MotherBoardInformation = motherboardSerialNumber;
          createUserLog.ActionType_ReferenceId = "662a289b7c8897c9bd45cd7a"; // Group: 'ActionType' Name: 'Login'
          createUserLog.save();
        } catch (err) {
          throw new Error(err);
        }

        throw new Error(`${path} does not exist.`);
      }
    }),

  check("Password")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const { Password, Email } = req.body;

      let existingUser, isValidPassword;

      try {
        existingUser = await userModel.findOne({ Email });
      } catch (err) {
        throw new Error(err);
      }

      if (existingUser !== null) {
        isValidPassword = await bycryptUtil.validatePassword(
          Password,
          existingUser.Password
        );
      }

      if (isValidPassword === false && isValidPassword !== undefined) {
        const createUserLog = new userLogModel();

        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(Password, 12);
        } catch (err) {
          const error = new HttpError(err, 500);
          return next(error);
        }

        try {
          const localIpAddress = await hardwareInfoUtil.getLocalIpAddress();
          const publicIpAddress = await hardwareInfoUtil.getPublicIpAddress();
          const computerName = await hardwareInfoUtil.getComputerName();
          const computerUsername = os.userInfo().username;
          const motherboardSerialNumber =
            await hardwareInfoUtil.getMotherboardSerialNumber();

          createUserLog.Email = Email;
          createUserLog.Password = hashedPassword;
          createUserLog.Result = `${path} is not valid.`;
          createUserLog.LocalIpAddress = localIpAddress;
          createUserLog.PublicIpAddress = publicIpAddress;
          createUserLog.ComputerName = computerName;
          createUserLog.SystemUsername = computerUsername;
          createUserLog.MotherBoardInformation = motherboardSerialNumber;
          createUserLog.ActionType_ReferenceId = "662a289b7c8897c9bd45cd7a"; // Group: 'ActionType' Name: 'Login'
          createUserLog.save();
        } catch (err) {
          throw new Error(err);
        }

        throw new Error(`${path} is not valid.`);
      }
    }),
];

const signupForm = () => [
  check("Email")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { path }) => "Please provide a valid email address")
    .bail()
    .custom(async (value, { req, path }) => {
      try {
        existingUser = await userModel.findOne({ Email: value });
      } catch (err) {
        throw new Error(err);
      }

      if (existingUser !== null) {
        throw new Error(`${path} exists already, please login instead.`);
      }
    }),

  check("Password")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isLength({ min: 5 })
    .withMessage(
      (value, { path }) => `${path} must be at least 5 characters long`
    )
    .bail()
    .matches(/^\S*$/)
    .withMessage("Password must not contain spaces"),

  check("BusinessName")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`),

  check("CountryId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`),
];

const forgotPasswordForm = () => [
  check("Email")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { path }) => "Please provide a valid email address")
    .bail(),
];

const resetPasswordForm = () => [
  check("Email")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { path }) => "Please provide a valid email address")
    .bail()
    .custom(async (value, { req, path }) => {
      try {
        existingUser = await userModel.findOne({ Email: value });
      } catch (err) {
        throw new Error(err);
      }

      if (existingUser === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("Password")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`),

  check("ConfirmPassword")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      if (value != req.body.Password) {
        throw new Error("Password's does not match.");
      }
    }),
];

exports.loginForm = loginForm;
exports.signupForm = signupForm;
exports.forgotPasswordForm = forgotPasswordForm;
exports.resetPasswordForm = resetPasswordForm;
