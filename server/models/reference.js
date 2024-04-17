const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const referenceSchema = new Schema({
  Group: { type: String, required: true },
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Code: { type: String, required: true, unique: true },
  Sequence: { type: Number, required: true },
});

referenceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Reference", referenceSchema);
