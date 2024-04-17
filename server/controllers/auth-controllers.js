const { check } = require("express-validator");
const mongoose = require("mongoose");

const userModel = require("../models/user");
const addressModel = require("../models/address");
const referenceModel = require("../models/reference");
const HttpError = require("../models/http-error");

const auth = require("../utils/authUtil");
const bycryptUtil = require("../utils/bycryptUtil");

const signup = async (req, res, next) => {
  const {
    Email,
    Phone,
    Username,
    Password,
    StreetAddress,
    City,
    Region,
    PostalCode,
    Country,
    BusinessName,
    Currency,
    Timezone,
    Language,
  } = req.body;

  const createdAddress = new addressModel({
    StreetAddress,
    City,
    Region,
    PostalCode,
    Country,
  });

  const createdUser = new userModel({
    AddressId: null,
    Email,
    Phone,
    Username,
    Password,
    BusinessName,
    Currency,
    Timezone,
    Language,
    isFirstTimeLogin: false,
    UserType_ReferenceId: null,
    RecordStatusType_ReferenceId: null,
  });

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    const referenceData = await referenceModel.find({
      Group: { $in: ["UserType", "RecordStatusType"] },
    });

    const UserType_Owner = referenceData.find(
      (reference) =>
        reference.Group === "UserType" && reference.Name === "Owner"
    );

    const RecordStatusType_Inactive = referenceData.find(
      (reference) =>
        reference.Group === "RecordStatusType" && reference.Name === "Inactive"
    );

    await createdAddress.save({ session: sess });

    const hashedPassword = await bycryptUtil.generateHashedPassword(Password);

    createdUser.AddressId = createdAddress.id;
    createdUser.Password = hashedPassword;
    createdUser.UserType_ReferenceId = UserType_Owner._id;
    createdUser.RecordStatusType_ReferenceId = RecordStatusType_Inactive._id;

    await createdUser.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const token = auth.generateToken(
    createdUser.id,
    createdUser.Email,
    "1h",
    next
  );

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.Email, token: token });
};

const login = async (req, res, next) => {
  const { Email, Password } = req.body;

  let existingUser;

  try {
    existingUser = await userModel.findOne({
      Email,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  const isValidPassword = await bycryptUtil.validatePassword(
    Password,
    existingUser.Password,
    next
  );

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  const token = auth.generateToken(
    existingUser.id,
    existingUser.Email,
    "1h",
    next
  );

  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};

const resetPassword = async (req, res, next) => {
  console.log("resetpassword");
  res.status(200).json({ message: "Successfuly Reset Password" });
};

exports.signup = signup;
exports.login = login;
exports.resetPassword = resetPassword;
