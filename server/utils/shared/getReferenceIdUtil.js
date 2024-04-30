const referenceModel = require("../../models/reference");
const HttpError = require("../../models/http-error");

const getReference = async (ActionType, Code) => {
  let reference;

  try {
    reference = await referenceModel.find({
      Group: { $in: ActionType },
      Code: { $in: Code },
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return reference;
};

const getReferenceId = async (ActionType, Code) => {
  let reference;

  try {
    reference = await referenceModel.findOne({
      Group: ActionType,
      Code: Code,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return reference._id;
};

const findReferenceId = (referenceData, ActionType, Code) => {
  return referenceData.find(
    (reference) => reference.Group === ActionType && reference.Code === Code
  )._id;
};
exports.getReference = getReference;
exports.getReferenceId = getReferenceId;
exports.findReferenceId = findReferenceId;
