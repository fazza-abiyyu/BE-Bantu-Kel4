const express = require("express");
const router = express.Router();
const Role = require("../utils/role.enum");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createJasa,
  getAllJasa,
  getJasaById,
  updateJasa,
  deleteJasa,
} = require("../controllers/jasa.controller");

// CREATE: Membuat jasa baru (hanya ADMIN)
router.post("/jasa", authMiddleware, roleMiddleware(Role.FREELANCER), createJasa);

// READ: Mendapatkan semua jasa (bisa diakses oleh semua role yang terautentikasi)
router.get("/jasa", getAllJasa);

// READ: Mendapatkan jasa berdasarkan ID (bisa diakses oleh semua role yang terautentikasi)
router.get("/jasa/:id", getJasaById);

// UPDATE: Mengupdate jasa berdasarkan ID (hanya ADMIN)
router.put("/jasa/:id", authMiddleware, roleMiddleware(Role.FREELANCER), updateJasa);

// DELETE: Menghapus jasa berdasarkan ID (hanya ADMIN)
router.delete(
  "/jasa/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  deleteJasa
);

module.exports = router;
