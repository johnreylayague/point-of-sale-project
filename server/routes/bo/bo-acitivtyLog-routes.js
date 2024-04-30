const express = require("express");

const activityLogController = require("../../controllers/bo/bo-activityLog-controllers");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/:id?", activityLogController.getActivityLogs);

module.exports = router;
