const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productDetail = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    default: null,
  },
  SKU: {
    type: String,
    required: true,
  },
  BarCode: {
    type: Number,
    default: null,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

productDetail.plugin(uniqueValidator);

module.exports = mongoose.model("ProductDetail", productDetail);
