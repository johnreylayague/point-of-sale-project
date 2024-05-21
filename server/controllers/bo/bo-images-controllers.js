const mongoose = require("mongoose");
const imageModel = require("../../models/image");
const referenceModel = require("../../models/reference");

const getImages = async (req, res, next) => {
  let images;

  try {
    images = await imageModel.find().sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  images = images.map((image) => image.toObject({ getters: true }));

  const total = images.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: images,
  });
};

exports.getImages = getImages;
