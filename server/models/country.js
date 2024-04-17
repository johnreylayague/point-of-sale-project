const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const countrySchema = new Schema({
  Name: { type: String, required: true },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

countrySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Country", countrySchema);
