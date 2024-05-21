const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const shapeSchema = new Schema({
  Shape: {
    type: String,
    required: true,
  },
  Default: {
    type: Boolean,
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

shapeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Shape", shapeSchema);
