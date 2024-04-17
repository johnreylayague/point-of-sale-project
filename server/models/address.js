const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  StreetAddress: { type: String, required: true },
  City: { type: String, required: true },
  Region: { type: String, required: true },
  PostalCode: { type: Number, required: true },
  Country: { type: String, required: true },
});

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Address", addressSchema);
