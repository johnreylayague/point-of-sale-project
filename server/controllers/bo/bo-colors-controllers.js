const mongoose = require("mongoose");
const colorModel = require("../../models/color");
const referenceModel = require("../../models/reference");

const getColors = async (req, res, next) => {
  let colors;

  try {
    colors = await colorModel.find().sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  colors = colors.map((color) => color.toObject({ getters: true }));

  const total = colors.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: colors,
  });
};

exports.getColors = getColors;
