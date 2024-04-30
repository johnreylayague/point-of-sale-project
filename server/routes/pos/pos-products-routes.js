const express = require("express");

const productsController = require("../../controllers/pos/pos-products-controllers");
const checkAuth = require("../../middleware/check-auth");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorProducts = require("../../utils/express-validator/pos/pos-products-express-validator");

const router = express.Router();

router.use(checkAuth);

router.get(
  "/",
  validateRequestMW.validateRequest(expressValidatorProducts.productsParam()),
  productsController.getProducts
);

module.exports = router;
