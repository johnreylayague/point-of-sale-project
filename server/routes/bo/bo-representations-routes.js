const express = require("express");

const representationsController = require("../../controllers/bo/bo-representations-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/bo/bo-products-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", representationsController.getRepresentations);

module.exports = router;
