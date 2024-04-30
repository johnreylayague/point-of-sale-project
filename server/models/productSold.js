const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productSoldSchema = new Schema({
  SalesId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Sales",
  },
  ProductId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  TotalPaid: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

productSoldSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ProductSold", productSoldSchema);
