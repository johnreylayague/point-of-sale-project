const { check, param, query } = require("express-validator");

const categoryModel = require("../../../models/category");
const colorModel = require("../../../models/color");
const referenceModel = require("../../../models/reference");

const categoriesParam = () => [
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

const categoriesForm = () => [
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
    .withMessage((value, { req, path }) => `${path} field is required.`)
    .bail()
    .custom(async (value, { req, path }) => {
      const categoryId = req.params.id ?? req.userData.userId;

      let category;

      try {
        const query = { Name: value, _id: { $ne: categoryId } };

        category = await categoryModel.find(query);
      } catch (err) {
        throw new Error(err);
      }

      if (category.length) {
        throw new Error(`${path} already exist.`);
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
    .custom(async (value, { req, path }) => {
      let colors;
      try {
        colors = await colorModel.find();
      } catch (err) {
        throw new Error(err);
      }

      const color = colors.filter((color) => color.id === value);

      if (!color.length) {
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
  //     let references;
  //     try {
  //       references = await referenceModel.find({
  //         Group: "RecordStatusType",
  //       });
  //     } catch (err) {
  //       throw new Error(err);
  //     }

  //     const reference = references.filter(
  //       (reference) => reference._id.toString() === value
  //     );

  //     if (!reference.length) {
  //       throw new Error(`${path} does not exist.`);
  //     }
  //   }),
];

exports.categoriesForm = categoriesForm;
exports.categoriesParam = categoriesParam;
