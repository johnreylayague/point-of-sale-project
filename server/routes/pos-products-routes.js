const express = require("express");

const productsController = require("../controllers/pos-products-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", productsController.getProducts);

module.exports = router;
