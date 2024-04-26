const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  UserId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Token: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  // isVerified: { type: Boolean, default: false },
  // VerificationMethodType_ReferenceId: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   ref: "Reference",
  // },
  // TokenType_ReferenceId: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   ref: "Reference",
  // },
});

tokenSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Token", tokenSchema);
