const { check, param, query } = require("express-validator");

const categoryModel = require("../../../models/category");
const colorModel = require("../../../models/color");
const shapeModel = require("../../../models/shape");
const soldByOptionModel = require("../../../models/soldByOption");
const referenceModel = require("../../../models/reference");
const productDetailModel = require("../../../models/productDetail");
const productModel = require("../../../models/product");
const representationModel = require("../../../models/representation");
const formatterUtil = require("../../../utils/shared/formatterUtil");

const {
  getProductSKU,
  getProductDetail,
} = require("../../aggregate/bo/bo-products-aggregate");
const { default: mongoose } = require("mongoose");

const productCategoryParam = () => [
  param("productId")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const userId = req.userData.userId;

      let product;
      try {
        product = await productModel.findOne({
          CreatorId: userId,
          _id: value,
        });
      } catch (err) {
        throw new Error(err);
      }

      if (!product) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  param("categoryId")
    .trim()
    .customSanitizer((value) => {
      return value === "" ? null : value;
    })
    .if((value) => value !== null)
    .isMongoId()
    .withMessage((value, { path }) => `Id is an invalid MongoDB ObjectId.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const userId = req.userData.userId;

      let category;
      try {
        category = await categoryModel.findOne({
          CreatorId: userId,
          _id: value,
        });
      } catch (err) {
        throw new Error(err);
      }

      if (!category) {
        throw new Error(`${path} does not exist.`);
      }
    }),
];

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

const deleteGroupProductForm = () => [
  check("deleteProducts")
    .exists()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const { deleteProducts } = req.body;
      const userId = req.userData.userId;

      const requiredFields = ["id", "Name"];

      if (!Array.isArray(deleteProducts)) {
        throw new Error(`Must contain an array of objects of Id and Name`);
      }

      if (!deleteProducts.length) {
        throw new Error(`${path} field is required.`);
      }

      // Start of Missing Property
      const missingProperty = deleteProducts.map((product) =>
        requiredFields.filter((path) => !Object.keys(product).includes(path))
      );

      const errorMessageMissingProperty = missingProperty
        .map((property, index) => {
          let txt = ``;
          if (property.length) {
            const separator = formatterUtil.formatErrorMessages(property);
            txt = `Missing property [ ${separator} ] in Object ${index} `;
          }
          return txt;
        })
        .filter((txt) => txt != "");

      if (errorMessageMissingProperty.length) {
        const separator = formatterUtil.formatErrorMessages(
          errorMessageMissingProperty
        );
        throw new Error(separator);
      }
      // End of Missing Property

      // Start of Invalid Property
      const invalidProperty = deleteProducts.map((product) =>
        Object.keys(product).filter((key) => !requiredFields.includes(key))
      );

      const errorMessageInvalidProperty = invalidProperty
        .map((property, index) => {
          let txt = ``;
          if (property.length) {
            const separator = formatterUtil.formatErrorMessages(property);
            txt = `Invalid property [ ${separator} ] in Object ${index} `;
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
      // Start of Invalid Property

      // Start of Invalid Property
      const isNotEmptyField = deleteProducts
        .map((product, index) => {
          let txt = ``,
            acc = [];

          for (const key in product) {
            if (key === key && !product[key]) {
              acc.push(key);
            }
          }

          if (acc.length) {
            const separator = formatterUtil.formatErrorMessages(acc);
            txt = `${separator} field is required in Object ${index}`;
          }

          return txt;
        })
        .filter((txt) => txt != "");

      if (isNotEmptyField.length) {
        const separator = formatterUtil.formatErrorMessages(isNotEmptyField);
        throw new Error(separator);
      }
      // End of Invalid Property

      // Start of inValid MongoId
      const inValidMongoId = deleteProducts
        .filter((product) => !mongoose.Types.ObjectId.isValid(product.id))
        .reduce((acc, product) => {
          acc.push(product.Name);
          return acc;
        }, []);

      if (inValidMongoId.length) {
        const separator = formatterUtil.formatErrorMessages(inValidMongoId);
        throw new Error(
          ` Product [ ${separator} ] has an invalid MongoDB ObjectId.`
        );
      }
      // End of inValid MongoId

      const productIds = deleteProducts.reduce((acc, product) => {
        acc.push(product.id);
        return acc;
      }, []);

      let products;

      try {
        products = await productModel
          .find({
            CreatorId: userId,
            _id: {
              $in: productIds,
            },
          })
          .populate("ProductDetailId")
          .populate("InventoryId")
          .populate("AttachmentId");
      } catch (err) {
        throw new Error(err);
      }

      const existingProductId = products.reduce((acc, product) => {
        acc.push(product.id);
        return acc;
      }, []);

      const notExistingProductName = deleteProducts
        .filter((product) => !existingProductId.includes(product.id))
        .reduce((acc, product) => {
          acc.push(product.Name);
          return acc;
        }, []);

      if (notExistingProductName.length) {
        const separator = formatterUtil.formatErrorMessages(
          notExistingProductName
        );
        throw new Error(` Product [ ${separator} ] does not exist.`);
      }
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
      const userId = req.userData.userId;
      const productId = req.params.id;

      let productDetail;
      try {
        const query = getProductDetail(userId);

        if (productId) {
          query.push({
            $match: {
              $and: [
                {
                  $expr: {
                    $ne: ["$ProductId", { $toObjectId: productId }],
                  },
                },
                {
                  Name: value,
                },
              ],
            },
          });
        }

        if (!productId) {
          query.push({
            $match: {
              Name: value,
            },
          });
        }

        productDetail = await productDetailModel.aggregate(query);
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
      const userId = req.userData.userId;
      const productId = req.params.id;

      let productDetail;
      try {
        const query = getProductDetail(userId);

        if (productId) {
          query.push({
            $match: {
              $and: [
                {
                  $expr: {
                    $ne: ["$ProductId", { $toObjectId: productId }],
                  },
                },
                {
                  SKU: value,
                },
              ],
            },
          });
        }

        if (!productId) {
          query.push({
            $match: {
              SKU: value,
            },
          });
        }

        productDetail = await productDetailModel.aggregate(query);
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
      const userId = req.userData.userId;
      const productId = req.params.id;

      let productDetail;
      try {
        const query = getProductDetail(userId);

        if (productId) {
          query.push({
            $match: {
              $and: [
                {
                  $expr: {
                    $ne: ["$ProductId", { $toObjectId: productId }],
                  },
                },
                {
                  BarCode: value,
                },
              ],
            },
          });
        }

        if (!productId) {
          query.push({
            $match: {
              BarCode: value,
            },
          });
        }

        productDetail = await productDetailModel.aggregate(query);
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
    .customSanitizer((value, { req, path }) => {
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
    .customSanitizer((value, { req, path }) => {
      const { TrackStock } = req.body;
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
      return value === "" ? "0.00" : value;
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
      return value === "" ? "0.00" : value;
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
      if (!soldByOption) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  check("RepresentationId")
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
      let representation;
      try {
        representation = await representationModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }
      if (!representation) {
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
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
    .isMongoId()
    .withMessage(
      (value, { req, path }) => `${path} is an invalid MongoDB ObjectId.`
    )
    .bail()
    .custom(async (value, { req, path }) => {
      let shape;
      try {
        shape = await shapeModel.findById(value);
      } catch (err) {
        throw new Error(err);
      }
      if (!shape) {
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
    .notEmpty()
    .withMessage((value, { path }) => `${path} field is required.`)
    .bail()
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
      if (!color) {
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

      if (!category) {
        throw new Error(`${path} does not exist.`);
      }
    }),

  // check("RecordStatusType_ReferenceId")
  //   .exists()
  //   .withMessage((value, { path }) => `${path} field is required`)
  //   .bail()
  //   .trim()
  //   .customSanitizer((value) => {
  //     return value === "" ? null : value;
  //   })
  //   .notEmpty()
  //   .withMessage((value, { path }) => `${path} field is required.`)
  //   .bail()
  //   .isMongoId()
  //   .withMessage((value, { path }) => `${path} is an invalid MongoDB ObjectId.`)
  //   .bail()
  //   .custom(async (value, { req, path }) => {
  //     const { RecordStatusType_ReferenceId } = req.body;

  //     let references;

  //     try {
  //       references = await referenceModel.find({
  //         Group: "RecordStatusType",
  //       });
  //     } catch (err) {
  //       throw new Error(err);
  //     }

  //     const reference = references.filter(
  //       (reference) => reference._id.toString() === RecordStatusType_ReferenceId
  //     );

  //     if (!reference.length) {
  //       throw new Error(`${path} does not exist.`);
  //     }
  //   }),
];

exports.productCategoryParam = productCategoryParam;
exports.productParam = productParam;
exports.productForm = productForm;
exports.deleteGroupProductForm = deleteGroupProductForm;
