const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  StreetAddress: { type: String, default: null },
  City: { type: String, default: null },
  Region: { type: String, default: null },
  PostalCode: { type: Number, default: null },
  CountryId: { type: Number, required: true },
});

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Address", addressSchema);
