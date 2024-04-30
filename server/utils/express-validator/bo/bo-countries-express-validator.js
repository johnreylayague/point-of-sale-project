const { query, check, param } = require("express-validator");

const countriesParam = () => [
  query().custom((value, { req, path }) => {
    if (
      Object.keys(req.query).length !== 0 &&
      !req.query.hasOwnProperty("search")
    ) {
      throw new Error("search field is required.");
    }
    return true;
  }),
];

exports.countriesParam = countriesParam;
