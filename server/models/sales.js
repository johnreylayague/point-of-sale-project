const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const salesSchema = new Schema({
  // ProductSoldId: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     required: true,
  //     ref: "ProductSold",
  //   },
  // ],
  PaymentTypeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "PaymentType",
  },
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isVoid: {
    type: Boolean,
    required: true,
  },
  CashReceived: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  TotalPaid: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  Change: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  Timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

salesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sales", salesSchema);
