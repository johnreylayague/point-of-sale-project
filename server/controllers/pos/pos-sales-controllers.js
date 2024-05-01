const mongoose = require("mongoose");

const salesModel = require("../../models/sales");
const productSoldModel = require("../../models/productSold");
const activityLogModel = require("../../models/activityLog");
const HttpError = require("../../models/http-error");
const salesQuery = require("../../utils/aggregate/pos/pos-sales-aggregate");
const referenceIdUtil = require("../../utils/shared/referenceIdUtil");

const createSales = async (req, res, next) => {
  const { Products, PaymentTypeId, CashReceived, TotalPaid, Change } = req.body;
  const { userId } = req.userData;

  const createSales = new salesModel();
  const createActivityLog = new activityLogModel();

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createSales.PaymentTypeId = PaymentTypeId;
    createSales.CreatorId = userId;
    createSales.isVoid = false;
    createSales.CashReceived = CashReceived;
    createSales.TotalPaid = TotalPaid;
    createSales.Change = Change;
    createSales.RecordStatusType_ReferenceId =
      referenceIdUtil.RecordStatusTypeActive;
    await createSales.save({ session: sess });

    const modifiedProducts = Products.map((product) => ({
      ...product,
      SalesId: createSales.id,
      RecordStatusType_ReferenceId: referenceIdUtil.RecordStatusTypeActive,
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
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeCreate;
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
  const salesId = req.params.id;
  const { userId } = req.userData;

  const createSales = new salesModel();
  const createActivityLog = new activityLogModel();

  let sales;

  try {
    sales = await salesModel.findOne({ _id: salesId, CreatorId: userId });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!sales) {
    const error = new HttpError("Sales does not exist.", 404);
    return next(error);
  }

  let productSold;

  try {
    productSold = await productSoldModel.find({ SalesId: salesId });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!productSold.length) {
    const error = new HttpError("Sold Product does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = createSales.collection.name;
    createActivityLog.RecordId = createSales.id;
    createActivityLog.FieldName = Object.keys(createSales.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeDelete;
    createActivityLog.OldValue = {
      ...sales,
      productSold,
    };
    createActivityLog.NewValue = null;
    await createActivityLog.save({ session: sess });

    await sales.deleteOne({ session: sess });

    await productSoldModel.deleteMany(
      { _id: { $in: productSold.map((sold) => sold.id) }, SalesId: salesId },
      { session: sess }
    );

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
