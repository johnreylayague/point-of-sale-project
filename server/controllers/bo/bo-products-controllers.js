const mongoose = require("mongoose");

const productModel = require("../../models/product");
const activityLogModel = require("../../models/activityLog");
const productDetailModel = require("../../models/productDetail");
const inventoryModel = require("../../models/inventory");
const referenceModel = require("../../models/reference");
const categoryModel = require("../../models/category");
const attachmentModel = require("../../models/attachment");
const HttpError = require("../../models/http-error");
const productsQuery = require("../../utils/aggregate/bo/bo-products-aggregate");
const referenceIdUtil = require("../../utils/shared/referenceIdUtil");

const createProduct = async (req, res, next) => {
  const {
    Name,
    Description,
    SKU,
    BarCode,
    TrackStock,
    InStock,
    LowStock,
    Price,
    Cost,
    SoldByOptionId,
    CategoryId,
    ShapeId,
    ColorId,
    Image,
    RepresentationId,
    RecordStatusType_ReferenceId,
  } = req.body;
  const { userId } = req.userData;

  const createAttachment = new attachmentModel();
  const createProductDetail = new productDetailModel();
  const createInventory = new inventoryModel();
  const createActivityLog = new activityLogModel();
  const createProduct = new productModel();

  let product;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createInventory.TrackStock = TrackStock;
    createInventory.InStock = InStock;
    createInventory.LowStock = LowStock;
    createInventory.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    await createInventory.save({ session: sess });

    createProductDetail.InventoryId = createInventory.id;
    createProductDetail.Name = Name;
    createProductDetail.Description = Description;
    createProductDetail.SKU = SKU;
    createProductDetail.BarCode = BarCode;
    createProductDetail.RecordStatusType_ReferenceId =
      RecordStatusType_ReferenceId;
    await createProductDetail.save({ session: sess });

    createAttachment.Image = Image;
    createAttachment.RecordStatusType_ReferenceId =
      RecordStatusType_ReferenceId;
    await createAttachment.save({ session: sess });

    createProduct.InventoryId = createInventory.id;
    createProduct.ProductDetailId = createProductDetail.id;
    createProduct.AttachmentId = createAttachment.id;
    createProduct.SoldByOptionId = SoldByOptionId;
    createProduct.CategoryId = CategoryId;
    createProduct.ShapeId = ShapeId;
    createProduct.ColorId = ColorId;

    createProduct.Price = Price;
    createProduct.Cost = Cost;
    createProduct.CreatorId = userId;
    createProduct.RepresentationId = RepresentationId;
    createProduct.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;
    await createProduct.save({ session: sess });

    // activity log below

    product = { ...createProduct.toObject() };
    product.AttachmentId = createAttachment.toObject();
    product.ProductDetailId = createProductDetail.toObject();
    product.InventoryId = createInventory.toObject();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = productModel.collection.name;
    createActivityLog.RecordId = product._id;
    createActivityLog.FieldName = Object.keys(productModel.schema.paths);
    createActivityLog.OldValue = null;
    createActivityLog.NewValue = product;
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeCreate;

    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const { _id, _id: id, __v, CreatorId } = product;

  product = {
    _id,
    Name,
    Description,
    SKU,
    BarCode,
    Price,
    Cost,
    Image,
    TrackStock,
    InStock,
    LowStock,
    SoldByOptionId,
    CategoryId,
    ShapeId,
    ColorId,
    RepresentationId,
    RecordStatusType_ReferenceId,
    CreatorId,
    __v,
    id,
  };

  res.status(201).json({
    message: "sucessfully created records",
    data: product,
  });
};

const getProducts = async (req, res, next) => {
  const productId = req.params.id;
  const searchTerm = req.query.search;
  const { userId } = req.userData;

  let products;

  try {
    const query = productsQuery.getProducts(userId);

    if (searchTerm) {
      query.push({
        $match: {
          $or: [{ Name: { $regex: searchTerm, $options: "i" } }],
        },
      });
    }

    if (productId) {
      query.push({
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: productId }] },
        },
      });
    }

    products = await productModel.aggregate(query);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const total = products.length;

  res.status(200).json({
    message: "sucessfully retrieved records",
    total,
    data: products,
  });
};

const updatedProduct = async (req, res, next) => {
  const {
    Name,
    Description,
    SKU,
    BarCode,
    TrackStock,
    InStock,
    LowStock,
    Price,
    Cost,
    SoldByOptionId,
    CategoryId,
    ShapeId,
    ColorId,
    Image,
    RepresentationId,
    RecordStatusType_ReferenceId,
  } = req.body;
  const productId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();
  let product;

  try {
    product = await productModel
      .findOne({ _id: productId, CreatorId: userId })
      .populate("ProductDetailId")
      .populate("InventoryId")
      .populate("AttachmentId");
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (product === null) {
    const error = new HttpError("Product does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.OldValue = product.toObject(); // get OldValue of product

    product.ProductDetailId.Name = Name;
    product.ProductDetailId.Description = Description;
    product.ProductDetailId.SKU = SKU;
    product.ProductDetailId.BarCode = BarCode;

    product.InventoryId.TrackStock = TrackStock;
    product.InventoryId.InStock = InStock;
    product.InventoryId.LowStock = LowStock;

    product.Price = Price;
    product.Cost = Cost;

    product.AttachmentId.Image = Image;
    product.SoldByOptionId = SoldByOptionId;
    product.CategoryId = CategoryId;
    product.ShapeId = ShapeId;
    product.ColorId = ColorId;

    product.RepresentationId = RepresentationId;
    product.RecordStatusType_ReferenceId = RecordStatusType_ReferenceId;

    await product.save({ session: sess });
    await product.ProductDetailId.save({ session: sess });
    await product.InventoryId.save({ session: sess });
    await product.AttachmentId.save({ session: sess });

    createActivityLog.CreatorId = req.userData.userId;
    createActivityLog.CollectionName = productModel.collection.name;
    createActivityLog.RecordId = productId;
    createActivityLog.FieldName = Object.keys(productModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeUpdate;
    createActivityLog.NewValue = product.toObject();
    await createActivityLog.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const { _id, __v, CreatorId } = product.toObject();

  product = {
    _id,
    Name,
    Description,
    SKU,
    BarCode,
    Price,
    Cost,
    Image,
    TrackStock,
    InStock,
    LowStock,
    SoldByOptionId,
    CategoryId,
    ShapeId,
    ColorId,
    RepresentationId,
    RecordStatusType_ReferenceId,
    CreatorId,
    __v,
    id: _id,
  };

  res.status(200).json({
    message: "sucessfully updated records",
    data: product,
  });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { userId } = req.userData;

  const createActivityLog = new activityLogModel();

  let product;

  try {
    product = await productModel
      .findOne({ _id: productId, CreatorId: userId })
      .populate("ProductDetailId")
      .populate("InventoryId")
      .populate("AttachmentId");
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Product does not exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createActivityLog.CreatorId = userId;
    createActivityLog.CollectionName = productModel.collection.name;
    createActivityLog.RecordId = product.id;
    createActivityLog.FieldName = Object.keys(productModel.schema.paths);
    createActivityLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeDelete;
    createActivityLog.OldValue = product.toObject();
    createActivityLog.NewValue = null;
    await createActivityLog.save({ session: sess });

    await product.ProductDetailId.deleteOne({
      session: sess,
    });
    await product.InventoryId.deleteOne({ session: sess });
    await product.AttachmentId.deleteOne({ session: sess });
    await product.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({
    message: "sucessfully deleted records",
  });
};

exports.deleteProduct = deleteProduct;
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.updatedProduct = updatedProduct;