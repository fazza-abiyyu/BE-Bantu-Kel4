const express = require("express");
const router = express.Router();
const {
  createLowongan,
  getAllLowongan,
  editLowongan,
  deleteLowongan,
} = require("../controllers/lowongan.controller");
const companyMiddleware = require("../middleware/company.middleware");

router.post("/lowongan", companyMiddleware, createLowongan);
router.get("/lowongan", getAllLowongan);
router.put("/lowongan/:lowonganId", companyMiddleware, editLowongan);
router.delete("/lowongan/:lowonganId", companyMiddleware, deleteLowongan);

module.exports = router;
