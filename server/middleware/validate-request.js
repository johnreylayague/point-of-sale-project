const { validationResult } = require("express-validator");
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validateRequest = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(422)
      .json({ message: "validation failed", errors: errors.array() });
  };
};

exports.validateRequest = validateRequest;
