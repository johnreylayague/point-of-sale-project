const express = require("express");

const menusController = require("../../controllers/bo/bo-menus-controllers");
const validateRequestMW = require("../../middleware/validate-request");
const checkAuth = require("../../middleware/check-auth");
const expressValidatorMenu = require("../../utils/express-validator/bo/bo-menus-express-validator");

const router = express.Router();

router.use(checkAuth);

router.get(
  "/:id?",
  validateRequestMW.validateRequest(expressValidatorMenu.menuParam()),
  menusController.getMenus
);

router.post(
  "/",
  validateRequestMW.validateRequest(expressValidatorMenu.menuForm()),
  menusController.createMenu
);

router.put(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorMenu.menuForm()),
  menusController.updateMenu
);

router.delete(
  "/:id",
  validateRequestMW.validateRequest(expressValidatorMenu.menuParam()),
  menusController.deletedMenu
);

module.exports = router;
