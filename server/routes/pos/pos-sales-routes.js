const express = require("express");

const salesController = require("../../controllers/pos/pos-sales-controllers");
const expressValidatorMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/pos/pos-sales-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", salesController.getSales);

router.post(
  "/",
  expressValidatorMW.validateRequest(expressValidatorUtil.salesForm()),
  salesController.createSales
);

router.delete(
  "/:id",
  expressValidatorMW.validateRequest(expressValidatorUtil.salesParam()),
  salesController.deleteSales
);

module.exports = router;
