const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userLogSchema = new Schema({
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  Result: { type: String, default: null },
  LocalIpAddress: { type: String, required: true },
  PublicIpAddress: { type: String, required: true },
  ComputerName: { type: String, required: true },
  SystemUsername: { type: String, required: true },
  MotherBoardInformation: { type: Object, required: true },
  TimeStamp: {
    type: Date,
    default: Date.now,
  },
  ActionType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

userLogSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserLog", userLogSchema);
