const express = require("express");

const countriesController = require("../../controllers/bo/bo-countries-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const checkAuth = require("../../middleware/check-auth");
const expressValidatorCountries = require("../../utils/express-validator/bo/bo-countries-express-validator");

const router = express.Router();

router.use(checkAuth);

router.get(
  "/:code?",
  validateRequestMW.validateRequest(expressValidatorCountries.countriesParam()),
  countriesController.getCountries
);

module.exports = router;
