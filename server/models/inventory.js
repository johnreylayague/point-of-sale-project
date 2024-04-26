const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  TrackStock: {
    type: Boolean,
    required: true,
  },
  InStock: {
    type: Number,
    default: null,
  },
  LowStock: {
    type: Number,
    default: null,
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

inventorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Inventory", inventorySchema);
