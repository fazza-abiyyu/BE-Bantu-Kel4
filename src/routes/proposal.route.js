const express = require("express");
const router = express.Router();
const { createProposal ,updateProposalStatus} = require("../controllers/proposal.controller");
const Role = require("../utils/role.enum");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const { document } = require("../libs/multer");
router.post(
  "/proposal",
  authMiddleware,
  roleMiddleware(Role.USER),
  document.single("proposal"),
  createProposal
);
router.put(
  "/proposal/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  updateProposalStatus
);

module.exports = router;
