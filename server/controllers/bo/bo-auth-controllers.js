const mongoose = require("mongoose");

const os = require("os");
const nodemailer = require("nodemailer");
const userModel = require("../../models/user");
const userLogModel = require("../../models/userLog");
const tokenModel = require("../../models/token");
const addressModel = require("../../models/address");
const referenceModel = require("../../models/reference");
const HttpError = require("../../models/http-error");
const crypto = require("crypto");
const auth = require("../../utils/shared/authUtil");
const validateUtil = require("../../utils/shared/validateUtil_TBD");
const bycryptUtil = require("../../utils/shared/bycryptUtil");
const hardwareInfoUtil = require("../../utils/shared/hardwareInformationUtil");
const referenceIdUtil = require("../../utils/shared/referenceIdUtil");

const signup = async (req, res, next) => {
  const {
    Email,
    Password,
    CountryId,
    BusinessName,
    Currency,
    Timezone,
    Language,
  } = req.body;

  const createdAddress = new addressModel();
  const createdUser = new userModel();

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    createdAddress.CountryId = CountryId;
    await createdAddress.save({ session: sess });

    const hashedPassword = await bycryptUtil.generateHashedPassword(
      Password,
      next
    );

    createdUser.Email = Email;
    createdUser.Password = hashedPassword;
    createdUser.BusinessName = BusinessName;
    createdUser.Currency = Currency;
    createdUser.Timezone = Timezone;
    createdUser.Language = Language;
    createdUser.AddressId = createdAddress.id;
    createdUser.UserType_ReferenceId = referenceIdUtil.UserTypeOwner;
    createdUser.RecordStatusType_ReferenceId =
      referenceIdUtil.RecordStatusTypeInActive;
    await createdUser.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const token = auth.generateToken(
    createdUser.id,
    createdUser.Email,
    process.env.LOGIN_EXPIRES,
    next
  );

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.Email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { Email, Password } = req.body;

  let existingUser;

  try {
    existingUser = await userModel.findOne({
      Email,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Email does not exist.", 404);
    return next(error);
  }

  const createUserLog = new userLogModel();

  try {
    // const localIpAddress = await hardwareInfoUtil.getLocalIpAddress();
    // const publicIpAddress = await hardwareInfoUtil.getPublicIpAddress();
    // const computerName = await hardwareInfoUtil.getComputerName();
    // const computerUsername = os.userInfo().username;
    // const motherboardSerialNumber =
    // await hardwareInfoUtil.getMotherboardSerialNumber();

    const localIpAddress = "1";
    const publicIpAddress = "1";
    const computerName = "1";
    const computerUsername = "1";
    const motherboardSerialNumber = "1";

    createUserLog.Email = existingUser.Email;
    createUserLog.Password = existingUser.Password;
    createUserLog.Result = "Successfully Logged In";
    createUserLog.LocalIpAddress = localIpAddress;
    createUserLog.PublicIpAddress = publicIpAddress;
    createUserLog.ComputerName = computerName;
    createUserLog.SystemUsername = computerUsername;
    createUserLog.MotherBoardInformation = motherboardSerialNumber;
    createUserLog.ActionType_ReferenceId = referenceIdUtil.ActionTypeLogin;
    createUserLog.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  const token = auth.generateToken(
    existingUser.id,
    existingUser.Email,
    process.env.LOGIN_EXPIRES,
    next
  );

  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};

const forgotPassword = async (req, res, next) => {
  const { Email } = req.body;

  let user;
  try {
    user = await userModel.findOne({
      Email,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  // dli na e check ang email if nag exist for security purpose
  console.log("Email: ", user);

  if (user !== null) {
    // check if naay nag exist na token sa table sa kani na user Id
    let token;
    try {
      token = await tokenModel.find({ UserId: user.id });
    } catch (err) {
      const error = new HttpError(err, 500);
      return next(error);
    }

    //  if naay nag exist na token sa kani na UserId sa table e delete nato ang mga old na reset token kay usa ra dapat ang naa
    let deleteToken;
    if (token.length !== 0) {
      try {
        deleteToken = await tokenModel.deleteMany({ UserId: user.id });
      } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
      }
      console.log("forgotPassword : ", deleteToken); // check pilay na delete
    }

    // create token
    const resetToken = crypto.randomBytes(32).toString("hex");

    try {
      let createToken = new tokenModel();

      createToken.UserId = user.id;
      createToken.Token = resetToken;
      await createToken.save();
    } catch (err) {
      const error = new HttpError(err, 404);
      return next(error);
    }

    // // start of send email /w token
    // try {
    //   const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: 465,
    //     secure: true, // Use `true` for port 465, `false` for all other ports
    //     auth: {
    //       user: process.env.Email,
    //       pass: process.env.Password,
    //     },
    //   });

    //   const mailOptions = {
    //     from: "do-not-reply@gmail.com",
    //     to: user.Email,
    //     subject: "Password Reset",
    //     text: `Click the following link to reset your password: ${process.env.RESET_PASSWORD_URL}/${resetToken}`,
    //   };
    //   const info = await transporter.sendMail(mailOptions);
    //   console.log("Message sent: %s", info.messageId);
    // } catch (err) {
    //   const error = new HttpError(err, 404);
    //   return next(error);
    // }
    // // end of send email /w token
  }

  res.status(200).json({
    message:
      "If an account exists with that email address, you will receive an email with instructions on how to reset your password.",
  });
};

const resetPassword = async (req, res, next) => {
  const { Email, Password } = req.body;
  const resetToken = req.params.token;

  let token, user, deleteToken;

  try {
    token = await tokenModel.findOne({ Token: resetToken }).populate("UserId");
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if ((token && token.UserId.Email !== Email) || !token) {
    const error = new HttpError("Invalid or expired token", 422);
    return next(error);
  }

  // global variable
  const UserId = token.UserId.id;

  // ma expire ang reset token, if expire invalid na sya og e delete nato sa collection
  // same message ang token error pra dli nya mahibaw.an if active ang token
  if (validateUtil.isDurationPassed(token.CreatedAt) === true) {
    try {
      deleteToken = await tokenModel.deleteMany({
        UserId,
      });
    } catch (err) {
      const error = new HttpError(err, 500);
      return next(error);
    }

    const error = new HttpError("Invalid or expired token", 422);
    return next(error);
  }

  const hashedPassword = await bycryptUtil.generateHashedPassword(
    Password,
    next
  );

  try {
    user = await userModel.findByIdAndUpdate(
      { _id: UserId },
      { Password: hashedPassword },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("User does not exist", 500);
    return next(error);
  }

  try {
    deleteToken = await tokenModel.deleteMany({
      UserId: token.UserId,
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ message: "Successfuly reset password" });
};

exports.signup = signup;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
