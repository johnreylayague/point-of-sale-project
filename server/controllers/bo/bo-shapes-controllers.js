const mongoose = require("mongoose");
const shapeModel = require("../../models/shape");
const referenceModel = require("../../models/reference");

const getShapes = async (req, res, next) => {
  let shapes;

  try {
    shapes = await shapeModel.find().sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  shapes = shapes.map((shape) => shape.toObject({ getters: true }));

  const total = shapes.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: shapes,
  });
};

exports.getShapes = getShapes;
