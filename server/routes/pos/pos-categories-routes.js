const express = require("express");

const categoriesController = require("../../controllers/pos/pos-categories-controllers");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", categoriesController.getCategories);

module.exports = router;
