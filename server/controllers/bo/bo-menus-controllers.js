const mongoose = require("mongoose");

const menuModel = require("../../models/menu");
const referenceModel = require("../../models/reference");
const activityLogModel = require("../../models/activityLog");
const HttpError = require("../../models/http-error");
const referenceIdUtil = require("../../utils/shared/referenceIdUtil");

const getMenus = async (req, res, next) => {
  const menuId = req.params.id;
  const searchTerm = req.query.search;
  const { userId } = req.userData;

  let menus;

  try {
    const query = [
      {
        $match: {
          $expr: { $eq: ["$CreatorId", { $toObjectId: userId }] },
        },
      },
      { $addFields: { id: "$_id" } },
      { $sort: { _id: -1 } },
    ];

    if (searchTerm && !menuId) {
      console.log("searchTerm");
      query.push({
        $match: {
          $expr: {
            $or: [
              {
                $regexMatch: {
                  input: "$Name",
                  regex: searchTerm,
                  options: "i",
                },
              },
              {
                $regexMatch: {
                  input: "$Link",
                  regex: searchTerm,
                  options: "i",
                },
              },
            ],
          },
        },
      });
    }

    if (menuId && !searchTerm) {
      console.log("menuId");
      query.push({
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: menuId }] },
        },
      });
    }

    menus = await menuModel.aggregate(query);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = menus.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: menus,
  });
};

const createMenu = async (req, res, next) => {
  const {
    Name,
    ParentId,
    Link,
    Sequence,
    RecordStatusType_ReferenceId,
    MenuType_ReferenceId,
  } = req.body;
  const { userId } = req.userData;

  const createMenu = new menuModel();
  const createActivityLog = new activityLogModel();

  let menu, references;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createMenu.Name = Name;
    createMenu.ParentId = ParentId;
    createMenu.Link = Link;
    createMenu.Sequence = Sequence;
    createMenu.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    createMenu.MenuType_ReferenceId = MenuType_ReferenceId;
    createMenu.CreatorId = userId;
    await createMenu.save({ session: sess });

    // activity log below

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = menuModel.collection.name;
    createActivityLog.RecordId = createMenu.id;
    createActivityLog.FieldName = Object.keys(menuModel.schema.paths);
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = createMenu.toObject();
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeCreate;
    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  menu = createMenu.toObject({ getters: true });

  res.status(201).json({
    message: "sucessfully created records",
    date: menu,
  });
};

const updateMenu = async (req, res, next) => {
  const { Name, ParentId, Link, Sequence } = req.body;
  const menuId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let menu;

  try {
    menu = await menuModel.findOne({ CreatorId: userId, _id: menuId });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!menu) {
    const error = new HttpError("Menu does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.OldValue = menu.toObject();

    menu.Name = Name;
    menu.ParentId = ParentId;
    menu.Link = Link;
    menu.Sequence = Sequence;
    menu.CreatorId = userId;
    await menu.save({ session: sess });

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = menuModel.collection.name;
    createActivityLog.RecordId = menu.id;
    createActivityLog.FieldName = Object.keys(menuModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeUpdate;
    createActivityLog.NewValue = menu.toObject();
    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  menu = menu.toObject({ getters: true });

  res.status(200).json({
    message: "sucessfully updated records",
    data: menu,
  });
};

const deletedMenu = async (req, res, next) => {
  const menuId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let menu;
  try {
    menu = await menuModel.findOne({ CreatorId: userId, _id: menuId });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  if (menu === null) {
    const error = new HttpError("Menu does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = menuModel.collection.name;
    createActivityLog.RecordId = menu.id;
    createActivityLog.FieldName = Object.keys(menuModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeDelete;
    createActivityLog.OldValue = menu;
    createActivityLog.NewValue = null;

    await createActivityLog.save({ session: sess });
    await menu.deleteOne({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({
    message: "sucessfully deleted records",
  });
};

exports.getMenus = getMenus;
exports.createMenu = createMenu;
exports.updateMenu = updateMenu;
exports.deletedMenu = deletedMenu;
