const express = require("express");

const productsController = require("../controllers/bo-products-controllers");
const validateRequestMW = require("../middleware/validate-request");
const expressValidatorUtil = require("../utils/bo-products-express-validator");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get(
  "/:id?",
  validateRequestMW.validateRequest(expressValidatorUtil.productParam()),
  productsController.getProducts
);

router.post(
  "/",
  validateRequestMW.validateRequest(expressValidatorUtil.productForm()),
  productsController.createProduct
);

router.put(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorUtil.productForm()),
  productsController.updatedProduct
);

router.delete(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorUtil.productParam()),
  productsController.deleteProduct
);

module.exports = router;
