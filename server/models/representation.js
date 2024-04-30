const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const representationSchema = new Schema({
  Name: { type: String, required: true },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

representationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Representation", representationSchema);
