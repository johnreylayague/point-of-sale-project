const mongoose = require("mongoose");

const categoryModel = require("../../models/category");
const referenceModel = require("../../models/reference");
const userModel = require("../../models/user");
const HttpError = require("../../models/http-error");

const getCategories = async (req, res, next) => {
  const { userId } = req.userData;

  let category;
  try {
    category = await categoryModel
      .find({
        CreatorId: userId,
      })
      .sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = category.length;

  if (!total) {
    category = "no result found.";
  }

  res.status(200).json({
    message: "successfully retrieve records",
    total: total,
    data: category,
  });
};

exports.getCategories = getCategories;
