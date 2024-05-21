const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  ColorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Color",
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
