const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  RoleId: { type: Number, default: null },
  SystemSettingsId: { type: Number, default: null },
  AddressId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Address",
  },
  Email: { type: String, required: true, unique: true },
  Phone: { type: String, default: null },
  Username: { type: String, default: null },
  Password: { type: String, required: true },
  BusinessName: { type: String, required: true },
  Currency: { type: String, required: true },
  Timezone: { type: String, required: true },
  Language: { type: String, required: true },
  isFirstTimeLogin: { type: Boolean, required: true, default: false },
  UserType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
  RecordStatusType_ReferenceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Reference",
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
