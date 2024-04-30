const mongoose = require("mongoose");

const categoryModel = require("../../models/category");
const referenceModel = require("../../models/reference");
const userModel = require("../../models/user");
const salesModel = require("../../models/sales");
const productSoldModel = require("../../models/productSold");
const activityLogModel = require("../../models/activityLog");
const HttpError = require("../../models/http-error");
const salesQuery = require("../../utils/aggregate/pos/pos-sales-aggregate");
const referenceUtil = require("../../utils/shared/getReferenceIdUtil");

const createSales = async (req, res, next) => {
  const { Products, PaymentTypeId, CashReceived, TotalPaid, Change } = req.body;
  const { userId } = req.userData;

  const createSales = new salesModel();
  const createActivityLog = new activityLogModel();

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    const referenceData = await referenceUtil.getReference(
      ["RecordStatusType", "ActionType"],
      ["AC", "CRE"]
    );

    const create = referenceUtil.findReferenceId(
      referenceData,
      "ActionType",
      "CRE"
    );

    const active = referenceUtil.findReferenceId(
      referenceData,
      "RecordStatusType",
      "AC"
    );

    createSales.PaymentTypeId = PaymentTypeId;
    createSales.CreatorId = userId;
    createSales.isVoid = false;
    createSales.CashReceived = CashReceived;
    createSales.TotalPaid = TotalPaid;
    createSales.Change = Change;
    createSales.RecordStatusType_ReferenceId = active;
    await createSales.save({ session: sess });

    const modifiedProducts = Products.map((product) => ({
      ...product,
      SalesId: createSales.id,
      RecordStatusType_ReferenceId: active,
    }));

    await productSoldModel.create(modifiedProducts, {
      session: sess,
    });

    const salesAndProductSold = {
      ...createSales.toObject(),
      productSold: modifiedProducts,
    };

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = createSales.collection.name;
    createActivityLog.RecordId = createSales.id;
    createActivityLog.FieldName = Object.keys(createSales.schema.paths);
    createActivityLog.ActionType_ReferenceId = create;
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = salesAndProductSold;

    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({
    message: "successfully created records",
  });
};

const getSales = async (req, res, next) => {
  const { userId } = req.userData;

  let sales;
  try {
    sales = await salesModel.aggregate(salesQuery.getSales(userId));
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = sales.length;

  if (!sales) {
    sales = "no result found";
  }

  res.status(200).json({
    message: "successfully retrieve records",
    total,
    data: sales,
  });
};

const deleteSales = async (req, res, next) => {
  const {} = req.body;
  const salesId = req.params.id;
  const { userId } = req.userData;

  const createSales = new salesModel();
  const createActivityLog = new activityLogModel();

  let sales, productSold;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    sales = await salesModel
      .findOne({ _id: salesId, CreatorId: userId })
      .lean();
    productSold = await productSoldModel.find({ SalesId: salesId }).lean();

    if (!sales || !productSold) {
      const error = new HttpError("Sales does not exist.", 404);
      return next(error);
    }

    const salesAndProductSold = {
      ...sales,
      productSold,
    };

    const create = await referenceUtil.getReferenceId("ActionType", "CRE");

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = createSales.collection.name;
    createActivityLog.RecordId = createSales.id;
    createActivityLog.FieldName = Object.keys(createSales.schema.paths);
    createActivityLog.ActionType_ReferenceId = create;
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = salesAndProductSold;

    await createActivityLog.save({ session: sess });

    await salesModel.deleteOne(
      { _id: salesId, CreatorId: userId },
      { session: sess }
    );

    await productSoldModel.deleteMany({ SalesId: salesId }, { session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({
    message: "sucessfully deleted records",
  });
};

exports.deleteSales = deleteSales;
exports.createSales = createSales;
exports.getSales = getSales;
