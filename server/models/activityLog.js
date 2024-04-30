const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const activityLog = new Schema({
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  TimeStamp: {
    type: Date,
    default: Date.now,
  },
  CollectionName: { type: String, required: true },
  RecordId: { type: mongoose.Types.ObjectId, required: true },
  FieldName: { type: [String], required: true },
  OldValue: { type: Object, default: null },
  NewValue: { type: Object, default: null },
  ActionType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

activityLog.plugin(uniqueValidator);

module.exports = mongoose.model("ActivityLog", activityLog);
