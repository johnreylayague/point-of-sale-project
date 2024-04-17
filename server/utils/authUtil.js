const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const generateToken = (id, email, expiry, next) => {
  let token;
  try {
    token = jwt.sign({ userId: id, email: email }, process.env.JWT_KEY, {
      expiresIn: expiry,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return token;
};

exports.generateToken = generateToken;
