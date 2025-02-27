const express = require("express");
const router = express.Router();
const Role = require("../utils/role.enum");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createBidang,
  getAllBidang,
  updateBidang,
  deleteBidang,
} = require("../controllers/bidang.controller");

router.post(
  "/bidang",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  createBidang
);

router.get("/bidang", authMiddleware, getAllBidang);

router.put(
  "/bidang/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  updateBidang
);
router.delete(
  "/bidang/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  deleteBidang
);

module.exports = router;
