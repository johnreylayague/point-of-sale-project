const express = require("express");

const soldByOptionsController = require("../../controllers/bo/bo-soldByOptions-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/bo/bo-products-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", soldByOptionsController.getSoldByOptions);

module.exports = router;
