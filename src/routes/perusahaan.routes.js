const router = require("express").Router();
const {
  registerPerusahaan,
  editPerusahaan,
  loginPerusahaan,
} = require("../controllers/perusahaan.controller");
const { image } = require("../libs/multer");
const companyMiddleware = require("../middleware/company.middleware");

router.get("/", (req, res, next) => {
  return res.status(200).json({
    data: "succres",
  });
});
router.post("/company/register", image.single("image"), registerPerusahaan);
router.post("/company/login", loginPerusahaan);
router.put(
  "/company/edit",
  companyMiddleware,
  image.single("image"),
  editPerusahaan
);

module.exports = router;
