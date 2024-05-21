const mongoose = require("mongoose");
const soldByOptionModel = require("../../models/soldByOption");
const referenceModel = require("../../models/reference");

const getSoldByOptions = async (req, res, next) => {
  let soldByOptions;

  try {
    soldByOptions = await soldByOptionModel.find().sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  soldByOptions = soldByOptions.map((soldByOption) =>
    soldByOption.toObject({ getters: true })
  );

  const total = soldByOptions.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: soldByOptions,
  });
};

exports.getSoldByOptions = getSoldByOptions;
