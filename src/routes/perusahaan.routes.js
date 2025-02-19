const router = require("express").Router();
const {
  registerPerusahaan,
  editPerusahaan,
  loginPerusahaan,
} = require("../controllers/perusahaan.controller");
const { image } = require("../libs/multer");
const authMiddleware = require("../middleware/company.middleware");

router.get("/", (req, res, next) => {
  return res.status(200).json({
    data: "succres",
  });
});
router.post("/company/register", image.single("image"), registerPerusahaan);
router.post("/company/login", loginPerusahaan);
router.put("/company/edit", authMiddleware,image.single("image"), editPerusahaan);

module.exports = router;
