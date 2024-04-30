const mongoose = require("mongoose");
const activityLogModel = require("../../models/activityLog");
const referenceModel = require("../../models/reference");

const getActivityLogs = async (req, res, next) => {
  const {} = req.body;
  const activityLogId = req.params.id;
  const productId = req.query.productId;
  const actionType = req.query.actionType;

  let activityLogs;
  try {
    let query = {};

    if (activityLogId) {
      query = { RecordId: activityLogId };
    }

    if (productId && actionType) {
      references = await referenceModel.find({
        Group: { $in: ["ActionType"] },
      });

      const getActionTypeCreateId = references.find(
        (reference) => reference.Name.toLowerCase() === actionType.toLowerCase()
      );

      query = {
        RecordId: productId,
        ActionType_ReferenceId: getActionTypeCreateId,
      };
    }

    activityLogs = await activityLogModel
      .find(query)
      .populate("ActionType_ReferenceId", "Name")
      .sort({ _id: -1 });
  } catch (err) {
    const error = new HttpError(err, 404);
    return next(error);
  }

  activityLogs = activityLogs.map((activityLog) =>
    activityLog.toObject({ getters: true })
  );

  const total = activityLogs.length;

  res.status(201).json({
    message: "sucessfully retrieved records",
    total,
    data: activityLogs,
  });
};

exports.getActivityLogs = getActivityLogs;
