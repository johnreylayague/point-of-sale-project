const mongoose = require("mongoose");
const { check, param, query } = require("express-validator");

const paymentTypeModel = require("../../../models/paymentType");
const producteModel = require("../../../models/product");

const formatterUtil = require("../../shared/formatterUtil");

const salesParam = () => [
  param("id")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`),
];

const salesForm = () => [
  check("Products")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const productSold = req.body.Products;
      const { userId } = req.userData;

      const requiredFields = ["ProductId", "Quantity", "TotalPaid"];

      if (!Array.isArray(productSold) || productSold.length == 0) {
        throw new Error(
          `${path} value should be an array of objects, each containing ` +
            `'ProductId' (MongoId), 'Quantity' (decimal), and 'TotalPaid' (decimal) properties`
        );
      }

      const isNotAnObject = productSold.filter((product) => {
        if (typeof product != "object" || Array.isArray(product)) {
          return true;
        }
        return false;
      });

      if (isNotAnObject.length !== 0) {
        throw new Error(
          `${path} value should contain objects each containing ` +
            `'ProductId' (MongoId), 'Quantity' (decimal), and 'TotalPaid' (decimal) properties`
        );
      }

      const invalidProperty = productSold.map((product) =>
        Object.keys(product).filter(
          (property) => !requiredFields.includes(property)
        )
      );

      const errorMessageInvalidProperty = invalidProperty
        .map((property, index) => {
          let txt = ``;
          if (property.length) {
            const errorMessage = formatterUtil.formatErrorMessages(property);
            txt = `Invalid property [ ${errorMessage} ] in Object ${index} `;
          }
          return txt;
        })
        .filter((txt) => txt != "");

      if (errorMessageInvalidProperty.length) {
        const separator = formatterUtil.formatErrorMessages(
          errorMessageInvalidProperty
        );
        throw new Error(separator);
      }

      const missingProperty = productSold.map((product) =>
        requiredFields.filter(
          (property) => !Object.keys(product).includes(property)
        )
      );

      const errorMessageMissingProperty = missingProperty
        .map((property, index) => {
          let txt = ``;
          if (property.length) {
            const separator = formatterUtil.formatErrorMessages(property);
            txt = `Missing [ ${separator} ] in Object ${index} `;
          }
          return txt;
        })
        .filter((txt) => txt !== "");

      if (errorMessageMissingProperty.length) {
        const separator = formatterUtil.formatErrorMessages(
          errorMessageMissingProperty
        );
        throw new Error(separator);
      }

      const inputProducts = productSold.map(({ ProductId }) => ProductId);

      const isValidMongoId = inputProducts.filter(
        (productId) => !mongoose.Types.ObjectId.isValid(productId)
      );

      if (isValidMongoId.length) {
        const separator = formatterUtil.formatErrorMessages(isValidMongoId);
        throw new Error(` Id [ ${separator} ] is an invalid MongoDB ObjectId.`);
      }

      let products;

      try {
        products = await producteModel
          .find({
            CreatorId: userId,
            _id: { $in: inputProducts },
          })
          .select("_id");
      } catch (err) {
        throw new Error(err);
      }

      const productsId = products.map((product) => product.id);

      const getDoesNotExistProductId = productSold.map(({ ProductId }) => {
        const arrProductId = [];
        if (!productsId.includes(ProductId)) {
          arrProductId.push(ProductId);
        }
        return arrProductId;
      });

      const errorMessageNotExistingProductId = getDoesNotExistProductId
        .map((productId, index) => {
          let txt = ``;
          if (productId.length) {
            const separator = formatterUtil.formatErrorMessages(productId);
            txt = ` ${path} Id [ ${separator} ] does not exist in Object ${index} `;
          }
          return txt;
        })
        .filter((txt) => txt !== "");

      if (errorMessageNotExistingProductId.length) {
        const separator = formatterUtil.formatErrorMessages(
          errorMessageNotExistingProductId
        );
        throw new Error(separator);
      }
    }),

  check("PaymentTypeId")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      let paymentType;
      try {
        paymentType = await paymentTypeModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }

      if (paymentType === null) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("CashReceived")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isDecimal({ force_decimal: true, decimal_digits: "2" })
    .withMessage("Field must be a decimal number"),

  check("TotalPaid")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isDecimal({ force_decimal: true, decimal_digits: "2" })
    .withMessage("Field must be a decimal number"),

  check("Change")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isDecimal({ force_decimal: true, decimal_digits: "2" })
    .withMessage("Field must be a decimal number"),
];

exports.salesParam = salesParam;
exports.salesForm = salesForm;
