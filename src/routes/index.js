const router = require("express").Router();
const Perusahaan = require("./perusahaan.routes");

// API
router.use("/company", Perusahaan);

module.exports = router;
