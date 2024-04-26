const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");

const validatePassword = async (password, existingPassword) => {
  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingPassword);
  } catch (err) {
    throw new Error(err);
  }

  return isValidPassword;
};

const generateHashedPassword = async (password, next) => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  return hashedPassword;
};

exports.validatePassword = validatePassword;
exports.generateHashedPassword = generateHashedPassword;
