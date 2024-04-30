const mongoose = require("mongoose");

const categoryModel = require("../../models/category");
const referenceModel = require("../../models/reference");
const userModel = require("../../models/user");
const productQuery = require("../../utils/aggregate/pos/pos-products-aggregate");
const productModel = require("../../models/product");
const HttpError = require("../../models/http-error");

const getProducts = async (req, res, next) => {
  const searchTerm = req.query.search;
  const categoryId = req.query.categoryId;
  const barCode = req.query.barCode;
  const { userId } = req.userData;

  let products;

  try {
    let query = productQuery.getProducts(userId);

    if (searchTerm && !barCode && !categoryId) {
      console.log("searching by searchTerm");
      query.push({
        $match: {
          Name: { $regex: searchTerm, $options: "i" },
        },
      });
    }
    if (barCode && !searchTerm && !categoryId) {
      console.log("searching by barCode");
      query.push({
        $match: {
          $expr: { $eq: ["$BarCode", { $toInt: barCode }] },
        },
      });
    }
    if (categoryId && !searchTerm && !barCode) {
      console.log("searching by categoryId");
      query.push({
        $match: {
          $expr: { $eq: ["$CategoryId", { $toObjectId: categoryId }] },
        },
      });
    }
    products = await productModel.aggregate(query);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = products.length;

  if (!total) {
    products = "no result found.";
  }

  res.status(200).json({
    message: "successfully retrieved records",
    total,
    data: products,
  });
};

exports.getProducts = getProducts;
