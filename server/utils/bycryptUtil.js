const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");

const validatePassword = async (password, existingPassword, next) => {
  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingPassword);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );

    return next(error);
  }

  return isValidPassword;
};

const generateHashedPassword = async (password, next) => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }
  return hashedPassword;
};

exports.validatePassword = validatePassword;
exports.generateHashedPassword = generateHashedPassword;
