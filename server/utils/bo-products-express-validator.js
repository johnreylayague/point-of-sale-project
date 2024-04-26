const { check, param, query } = require("express-validator");

const categoryModel = require("../models/category");
const colorModel = require("../models/color");
const shapeModel = require("../models/shape");
const soldByOptionModel = require("../models/soldByOption");
const referenceModel = require("../models/reference");
const productDetailModel = require("../models/productDetail");

const productParam = () => [
  param("id")
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

exports.productParam = productParam;
exports.productForm = productForm;
