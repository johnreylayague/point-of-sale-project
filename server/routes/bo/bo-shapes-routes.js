const express = require("express");

const shapesController = require("../../controllers/bo/bo-shapes-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/bo/bo-products-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", shapesController.getShapes);

module.exports = router;
