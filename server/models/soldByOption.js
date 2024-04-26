const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const soldByOptionSchema = new Schema({
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Name: {
    type: String,
    required: true,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

soldByOptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SoldByOption", soldByOptionSchema);
