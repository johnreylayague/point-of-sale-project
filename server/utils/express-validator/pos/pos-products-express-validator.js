const { check, param, query } = require("express-validator");
const mongoose = require("mongoose");

const productsParam = () => [
  query("search").custom((value, { req, path }) => {
    const query = req.query;
    const barCode = req.query["barCode"],
      searchTerm = req.query["searchTerm"],
      categoryId = req.query["categoryId"],
      regex = /^[0-9]+$/;

    if (
      Object.keys(req.query).length !== 0 &&
      !query.hasOwnProperty("barCode") &&
      !query.hasOwnProperty("search") &&
      !query.hasOwnProperty("categoryId")
    ) {
      throw new Error(
        "At least one query parameter is required (search, barCode, categoryId)"
      );
    }

    if (barCode && !regex.test(barCode)) {
      throw new Error("Barcode must contain numbers only.");
    }

    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Id is an invalid MongoDB ObjectId.");
    }

    return true;
  }),
];

exports.productsParam = productsParam;
