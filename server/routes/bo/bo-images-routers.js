const express = require("express");

const imagesController = require("../../controllers/bo/bo-images-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const expressValidatorUtil = require("../../utils/express-validator/bo/bo-products-express-validator");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", imagesController.getImages);

module.exports = router;
