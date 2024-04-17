const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const userModel = require("../models/user");
const addressModel = require("../models/address");
const referenceModel = require("../models/reference");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  let address;
  try {
    users = await userModel.find();
    address = await addressModel.find();
  } catch (err) {
    return next(
      res.status(500).json("Fetching users failed, please try again later.")
    );
  }
  res.json({
    users: users.map((user) => {
      const { StreetAddress, City, Region, PostalCode, Country } = address.find(
        (address) => address._id.toString() === user.AddressId.toString()
      );

      return {
        email: user.Email,
        StreetAddress,
        City,
        Region,
        PostalCode,
        Country,
      };
    }),
  });
};

const deleteUser = async (req, res, next) => {
  const addressId = req.params.uid;
  try {
    await addressModel.deleteOne({ _id: addressId });
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete", 500);
    return next(err);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
