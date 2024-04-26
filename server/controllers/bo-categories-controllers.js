const mongoose = require("mongoose");

const categoryModel = require("../models/category");
const referenceModel = require("../models/reference");
const HttpError = require("../models/http-error");
const activityLogModel = require("../models/activityLog");

const createCategory = async (req, res, next) => {
  const { Name, RecordStatusType_ReferenceId } = req.body;
  const { userId } = req.userData;

  const createCategory = new categoryModel();
  const createActivityLog = new activityLogModel();

  let category;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createCategory.Name = Name;
    createCategory.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    createCategory.CreatorId = userId;
    await createCategory.save({ session: sess });

    // activity log below
    references = await referenceModel.find({
      Group: { $in: ["ActionType"] },
    });

    const getActionTypeCreate = references.find(
      (reference) => reference.Name === "Create"
    );

    createActivityLog.UserId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = createCategory.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = createCategory.toObject();
    createActivityLog.ActionType_ReferenceId = getActionTypeCreate.id;

    await createActivityLog.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  category = createCategory.toObject({ getters: true });

  res.status(201).json({
    message: "sucessfully retrieved records",
    data: category,
  });
};

const getCategories = async (req, res, next) => {
  const categoryId = req.params.id;
  const searchTerm = req.query.search;

  let categories;

  try {
    let query = {};
    if (searchTerm) {
      query = { Name: { $regex: searchTerm, $options: "i" } };
    }
    if (categoryId) {
      query = { _id: categoryId };
    }
    categories = await categoryModel.find(query).sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = categories.length;

  if (!categories.length) {
    categories = "no result found.";
  }

  res.status(200).json({
    message: "sucessfully retrieved records",
    total: total,
    data: categories,
  });
};

const updateCategory = async (req, res, next) => {
  const { Name, RecordStatusType_ReferenceId } = req.body;
  const categoryId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let category;

  try {
    category = await categoryModel.findById(categoryId);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (category === null) {
    const error = new HttpError("Category does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.OldValue = category.toObject();

    category.Name = Name;
    category.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    category.save();

    references = await referenceModel.find({
      Group: { $in: ["ActionType"] },
    });

    const getActionTypeUpdate = references.find(
      (reference) => reference.Name === "Update"
    );

    createActivityLog.UserId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = category.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = getActionTypeUpdate.id;
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
    category = await categoryModel.findById(categoryId);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (category === null) {
    const error = new HttpError("Category does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    references = await referenceModel.find({
      Group: { $in: ["ActionType"] },
    });

    const getActionTypeDelete = references.find(
      (reference) => reference.Name === "Delete"
    );

    createActivityLog.UserId = userId;
    createActivityLog.CollectionName = categoryModel.collection.name;
    createActivityLog.RecordId = category.id;
    createActivityLog.FieldName = Object.keys(categoryModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = getActionTypeDelete.id;
    createActivityLog.OldValue = category.toObject();
    createActivityLog.NewValue = null;
    await createActivityLog.save({ session: sess });

    await category.deleteOne({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({
    message: "sucessfully deleted records",
  });
};

exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
