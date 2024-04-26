const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  Name: { type: String, required: true },
  ParentId: { type: mongoose.Types.ObjectId, default: null, ref: "Menu" },
  Link: { type: String, required: true },
  Sequence: { type: Number, required: true },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
  MenuType_ReferenceId: {
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

menuSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Menu", menuSchema);
