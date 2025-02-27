const express = require("express");
const router = express.Router();
const {
  applyLowongan,
  lamaranPerusahaan,
  editLamaran,
} = require("../controllers/lamaran.controller");
const Role = require("../utils/role.enum");
const roleMiddleware = require("../middleware/role.middleware");
const companyMiddleware = require("../middleware/company.middleware");

const { document } = require("../libs/multer");
router.post(
  "/job-application",
  roleMiddleware(Role.USER),
  document.single("file"),
  applyLowongan
);
router.get(
  "/job-application/:lowonganId",
  companyMiddleware,
  lamaranPerusahaan
);
router.put("/job-application", companyMiddleware, editLamaran);

module.exports = router;
