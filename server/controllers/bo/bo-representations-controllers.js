const mongoose = require("mongoose");
const representationModel = require("../../models/representation");
const referenceModel = require("../../models/reference");

const getRepresentations = async (req, res, next) => {
  let representations;

  try {
    representations = await representationModel.find().sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  representations = representations.map((color) =>
    color.toObject({ getters: true })
  );

  const total = representations.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: representations,
  });
};

exports.getRepresentations = getRepresentations;
