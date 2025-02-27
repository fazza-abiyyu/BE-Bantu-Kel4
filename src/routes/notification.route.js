const express = require("express");
const router = express.Router();
const Role = require("../utils/role.enum");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  gettAllNotification,
} = require("../controllers/notification.controller");

router.get(
  "/notification",
  authMiddleware,
  roleMiddleware(Role.USER, Role.FREELANCER),
  gettAllNotification
);

module.exports = router;
