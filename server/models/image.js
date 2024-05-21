const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const imagesSchema = new Schema({
  Images: {
    type: String,
    required: true,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
  RepresentationId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Representation",
  },
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

imagesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Image", imagesSchema);
