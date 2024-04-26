const mongoose = require("mongoose");
const { query, check, param } = require("express-validator");
const menuModel = require("../models/menu");
const referenceModel = require("../models/reference");

const menuParam = () => [
  param("id")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage(
      (value, { path }) => `${path} is an invalid MongoDB ObjectId.`
    ),

  query().custom((value, { req, path }) => {
    if (
      Object.keys(req.query).length !== 0 &&
      !req.query.hasOwnProperty("search")
    ) {
      throw new Error("search field is required.");
    }
    return true;
  }),
];

const menuForm = () => [
  param("id")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`),

  check("Name")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let menus;
      try {
        menus = await menuModel.find({ Name: value });
      } catch (err) {
        throw new Error(err);
      }
      if (menus.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("ParentId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let menu;
      try {
        menu = await menuModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }

      if (menu === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("Link")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .custom(async (value, { req, path }) => {
      let menu;
      try {
        menu = await menuModel.find({ Link: value });
      } catch (err) {
        throw new Error(err);
      }
      if (menu.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("Sequence")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .isNumeric()
    .withMessage((value, { path }) => `${path} field must be numeric.`),

  check("RecordStatusType_ReferenceId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req }) => {
      const { RecordStatusType_ReferenceId } = req.body;

      let references;

      try {
        references = await referenceModel.find({
          Group: "RecordStatusType",
        });
      } catch (err) {
        throw new Error(err);
      }

      const reference = references.filter(
        (reference) => reference._id.toString() === RecordStatusType_ReferenceId
      );

      if (!reference.length) {
        throw new Error("RecordStatusType_ReferenceId does not exist.");
      }
    }),

  check("MenuType_ReferenceId")
    .trim()
    .notEmpty()
    .withMessage("MenuType_ReferenceId is required")
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req }) => {
      const { MenuType_ReferenceId } = req.body;

      let references;

      try {
        references = await referenceModel.find({
          Group: "MenuType",
        });
      } catch (err) {
        throw new Error(err);
      }

      const reference = references.filter(
        (reference) => reference._id.toString() === MenuType_ReferenceId
      );

      if (!reference.length) {
        throw new Error("MenuType_ReferenceId does not exist.");
      }
    }),
];

exports.menuParam = menuParam;
exports.menuForm = menuForm;
