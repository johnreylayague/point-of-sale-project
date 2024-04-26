const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  CategoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  ProductDetailId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ProductDetail",
  },
  InventoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Inventory",
  },
  SoldByOptionId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "SoldByOption",
  },
  AttachmentId: {
    type: mongoose.Types.ObjectId,
    ref: "Attachment",
    default: null,
  },
  ColorId: {
    type: mongoose.Types.ObjectId,
    ref: "Color",
    default: null,
  },
  ShapeId: {
    type: mongoose.Types.ObjectId,
    ref: "Shape",
    default: null,
  },
  Price: {
    type: mongoose.Types.Decimal128,
    default: null,
  },
  Cost: {
    type: mongoose.Types.Decimal128,
    default: null,
  },
  CreatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Product", productSchema);
