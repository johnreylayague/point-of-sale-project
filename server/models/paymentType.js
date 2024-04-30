const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const paymentTypeSchema = new Schema({
  Name: { type: String, required: true },
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

paymentTypeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PaymentType", paymentTypeSchema);
