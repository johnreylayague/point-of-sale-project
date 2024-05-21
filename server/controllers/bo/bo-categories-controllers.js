const mongoose = require("mongoose");

const categoryModel = require("../../models/category");
const colorModel = require("../../models/color");
const HttpError = require("../../models/http-error");
const activityLogModel = require("../../models/activityLog");
const referenceIdUtil = require("../../utils/shared/referenceIdUtil");
const categoryQuery = require("../../utils/aggregate/bo/bo-categories-aggregate");

const getCategoriesProductColors = async (req, res, next) => {
  const categoryId = req.params.id;
  const searchTerm = req.query.search;
  const { userId } = req.userData;

  let categories;

  try {
    const query = categoryQuery.getCategory(userId);

    if (searchTerm && !categoryId) {
      query.push({
        $match: {
          $or: [{ Name: { $regex: searchTerm, $options: "i" } }],
        },
      });
    }

    if (categoryId && !searchTerm) {
      query.push({
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: categoryId }] },
        },
      });
    }

    categories = await categoryModel.aggregate(query);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const data = categories;

  const total = categories.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data,
  });
};

const createCategory = async (req, res, next) => {
  const { Name, ColorId } = req.body;
  const { userId } = req.userData;

  const createCategory = new categoryModel();
  const createActivityLog = new activityLogModel();

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createCategory.Name = Name;
    createCategory.RecordStatusType_ReferenceId =
      referenceIdUtil.RecordStatusTypeActive;
    createCategory.CreatorId = userId;
    createCategory.ColorId = ColorId;
    await createCategory.save({ session: sess });

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = createCategory.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = createCategory.toObject();
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeCreate;

    await createActivityLog.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const data = createCategory.toObject({ getters: true });

  res.status(201).json({
    message: "sucessfully created records",
    data,
  });
};

const getCategories = async (req, res, next) => {
  const categoryId = req.params.id;
  const searchTerm = req.query.search;
  const { userId } = req.userData;

  let categories;

  try {
    const query = categoryQuery.getCategory(userId);

    if (searchTerm && !categoryId) {
      query.push({
        $match: {
          $or: [{ Name: { $regex: searchTerm, $options: "i" } }],
        },
      });
    }

    if (categoryId && !searchTerm) {
      query.push({
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: categoryId }] },
        },
      });
    }

    categories = await categoryModel.aggregate(query);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const data = categories;

  const total = categories.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data,
  });
};

const updateCategory = async (req, res, next) => {
  const { Name, RecordStatusType_ReferenceId, ColorId } = req.body;
  const categoryId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let category;

  try {
    category = await categoryModel.findOne({
      CreatorId: userId,
      _id: categoryId,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!category) {
    const error = new HttpError("Category does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.OldValue = category.toObject();

    category.Name = Name;
    category.ColorId = ColorId;
    category.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    category.save();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = category.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeUpdate;
    createActivityLog.NewValue = category.toObject();

    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({
    message: "sucessfully updated records",
    data: category,
  });
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let category;

  try {
    category = await categoryModel.findOne({
      CreatorId: userId,
      _id: categoryId,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!category) {
    const error = new HttpError("Category does not exist.", 404);
    return next(error);
  }

  let result;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = category.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeDelete;
    createActivityLog.OldValue = category.toObject();
    createActivityLog.NewValue = null;
    await createActivityLog.save({ session: sess });

    result = await category.deleteOne({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const data = category.toObject({ getters: true });

  res.status(200).json({
    message: "sucessfully deleted records",
    data,
  });
};

exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategoriesProductColors = getCategoriesProductColors;
