const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  Image: {
    type: String,
    default: null,
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

attachmentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Attachment", attachmentSchema);
