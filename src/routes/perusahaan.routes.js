const router = require("express").Router();
const {
  registerPerusahaan,
  editPerusahaan,
} = require("../controllers/perusahaan.controllers");
const { image } = require("../libs/multer");

router.get("/", (req, res, next) => {
  return res.status(200).json({
    data: "succres",
  });
});
router.post("/register", image.single("image"), registerPerusahaan);
router.put("/:id", image.single("image"), editPerusahaan);

module.exports = router;
