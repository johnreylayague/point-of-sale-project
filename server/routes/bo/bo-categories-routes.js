const express = require("express");

const categoriesController = require("../../controllers/bo/bo-categories-controllers");

const validateRequestMW = require("../../middleware/validate-request");

const expressValidatorCategory = require("../../utils/express-validator/bo/bo-categories-express-validator");

const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get(
  "/:id?",
  validateRequestMW.validateRequest(expressValidatorCategory.categoriesParam()),
  categoriesController.getCategories
);

router.post(
  "/",
  validateRequestMW.validateRequest(expressValidatorCategory.categoriesForm()),
  categoriesController.createCategory
);

router.put(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorCategory.categoriesForm()),
  categoriesController.updateCategory
);

router.delete(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorCategory.categoriesParam()),
  categoriesController.deleteCategory
);

module.exports = router;
