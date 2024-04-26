const mongoose = require("mongoose");

const { check, param, query } = require("express-validator");

const bycryptUtil = require("../utils/bycryptUtil");

const categoryModel = require("../models/category");
const userModel = require("../models/user");
const colorModel = require("../models/color");
const menuModel = require("../models/menu");
const shapeModel = require("../models/shape");
const soldByOptionModel = require("../models/soldByOption");
const referenceModel = require("../models/reference");
const productDetailModel = require("../models/productDetail");

const validateSignupInputs = () => [
  check("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 255 })
    .custom(async (value, { req }) => {
      const { Email } = req.body;
      try {
        existingUser = await userModel.findOne({ Email: Email });
      } catch (err) {
        throw new Error(err);
      }

      if (existingUser) {
        throw new Error("User exists already, please login instead.");
      }
    }),

  check("Password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(/^\S*$/)
    .withMessage("Password must not contain spaces"),

  check("BusinessName")
    .trim()
    .notEmpty()
    .withMessage("Business Name is required"),

  check("CountryId").trim().notEmpty().withMessage("Country is required"),
];

const validateLoginInputs = () => [
  check("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .custom(async (value, { req }) => {
      const { Email } = req.body;

      try {
        existingUser = await userModel.findOne({ Email });
      } catch (err) {
        throw new Error(err);
      }

      if (!existingUser) {
        throw new Error("Email does not exist.");
      }
    }),

  check("Password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .custom(async (value, { req, res, next }) => {
      const { Password, Email } = req.body;

      let existingUser, isValidPassword;

      try {
        existingUser = await userModel.findOne({ Email });
      } catch (err) {
        throw new Error(err);
      }

      if (existingUser) {
        isValidPassword = await bycryptUtil.validatePassword(
          Password,
          existingUser.Password
        );
      }

      if (!isValidPassword && isValidPassword != null) {
        throw new Error("Password is not valid");
      }
    }),
];

const categoryParam = () => [
  param("cid")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`),

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

const menuParam = () => [
  param("mid")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`),

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

const productParam = () => [
  param("pid")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`),

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

const productForm = () => [
  param("pid")
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
      let productDetail;
      try {
        productDetail = await productDetailModel.find({ Name: value });
      } catch (err) {
        throw new Error(err);
      }
      if (productDetail.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("Description")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    }),

  check("SKU")
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
      let productDetail;
      try {
        productDetail = await productDetailModel.find({ SKU: value });
      } catch (err) {
        throw new Error(err);
      }
      if (productDetail.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("BarCode")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isNumeric()
    .withMessage((value, { path }) => `${path} field must be numeric.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let productDetail;
      try {
        productDetail = await productDetailModel.find({ BarCode: value });
      } catch (err) {
        throw new Error(err);
      }
      if (productDetail.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("TrackStock")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isBoolean()
    .withMessage((value, { path }) => `${path} field must be a boolean.`),

  check("InStock")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isNumeric()
    .withMessage((value, { path }) => `${path} field must be numeric.`),

  check("LowStock")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isNumeric()
    .withMessage((value, { path }) => `${path} field must be numeric.`),

  check("Price")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isDecimal({ force_decimal: true, decimal_digits: "2" })
    .withMessage("Field must be a decimal number"),

  check("Cost")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isDecimal({ force_decimal: true, decimal_digits: "2" })
    .withMessage("Field must be a decimal number."),

  check("SoldByOptionId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let soldByOption;
      try {
        soldByOption = await soldByOptionModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }
      if (soldByOption === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("ShapeId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let shape;
      try {
        shape = await shapeModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }
      if (shape === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("ColorId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req }) => {
      let color;
      try {
        color = await colorModel.findById(value).exec();
      } catch (err) {
        throw new Error(err);
      }
      if (color === null) {
        throw new Error("ColorId Does not Exist");
      }
    }),

  check("Image")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    }),

  check("CategoryId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required`)
    .bail()
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let category;
      try {
        category = await categoryModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }

      if (category === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("RecordStatusType_ReferenceId")
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
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
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
        throw new Error(`${path} does not exist.`);
      }
    }),
];

const categoryForm = () => [
  param("cid")
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
    .withMessage((value, { req, path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let category;
      try {
        category = await categoryModel.find({ Name: value });
      } catch (err) {
        throw new Error(err);
      }

      if (category.length) {
        throw new Error(`${path} already exist.`);
      }
    }),

  check("RecordStatusType_ReferenceId")
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
    .isMongoId()
    .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let references;
      try {
        references = await referenceModel.find({
          Group: "RecordStatusType",
        });
      } catch (err) {
        throw new Error(err);
      }

      const reference = references.filter(
        (reference) => reference._id.toString() === value
      );

      if (!reference.length) {
        throw new Error(`${path} does not exist.`);
      }
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
      const { RecordStatusType_ReferenceId } = convertEmptyStringsToNull(
        req.body
      );

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
      const { MenuType_ReferenceId } = convertEmptyStringsToNull(req.body);

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

const getValueOrEmptyString = (propertyValue, defaultValue) => {
  return propertyValue === null ? null : propertyValue[defaultValue];
};

const convertEmptyStringsToNull = (objectValue) => {
  Object.keys(objectValue).forEach((key) => {
    objectValue[key] = objectValue[key] === "" ? null : objectValue[key];
  });

  return objectValue;
};

const convertToDecimal = (value) => {
  return Number.parseFloat(value ?? 0).toFixed(2);
};

const convertToString = (value) => {
  return value !== null ? value.toString() : value;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const toObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

const isDurationPassed = (dateValue) => {
  const tokenDate = new Date(dateValue);
  const currentDate = new Date();

  const diffMs = currentDate - tokenDate;
  const durationMs = process.env.RESET_PASSWORD_EXPIRATION_MINUTES * 60 * 1000;
  return diffMs >= durationMs;
};

exports.validateLoginInputs = validateLoginInputs;
exports.validateSignupInputs = validateSignupInputs;
exports.productForm = productForm;
exports.productParam = productParam;
exports.categoryForm = categoryForm;
exports.getValueOrEmptyString = getValueOrEmptyString;
exports.convertEmptyStringsToNull = convertEmptyStringsToNull;
exports.menuForm = menuForm;
exports.convertToDecimal = convertToDecimal;
exports.isValidObjectId = isValidObjectId;
exports.convertToString = convertToString;
exports.menuParam = menuParam;
exports.categoryParam = categoryParam;
exports.isDurationPassed = isDurationPassed;
exports.toObjectId = toObjectId;
