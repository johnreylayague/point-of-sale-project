const express = require("express");

const colorsController = require("../../controllers/bo/bo-colors-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/bo/bo-products-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", colorsController.getColors);

module.exports = router;
