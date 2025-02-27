const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

exports.createProposal = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const file = req.file;
    let fileUrl = "";
    const uniqueCode = req.uniqueCode;

    // Validasi input
    if (!userId || !file) {
      throw new CustomError(400, "UserId and file are required");
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new CustomError(404, "User not found");
    }

    if (file) {
      fileUrl = `/api/docs/${uniqueCode}-${file.originalname.replace(
        /\s+/g,
        "-"
      )}`;
    } else {
      throw new CustomError(400, "File Proposal must be Upload");
    }

    // Buat proposal
    const proposal = await prisma.proposalFreelance.create({
      data: {
        userId: parseInt(userId),
        fileProposal: fileUrl,
        status: "pending",
      },
    });

    return res.status(201).json({
      status: true,
      message: "Proposal created successfully",
      data: proposal,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProposalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (!["diterima", "ditolak"].includes(status)) {
      throw new CustomError(
        400,
        "Invalid status. Allowed values: APPROVED, REJECTED"
      );
    }

    // Cek apakah proposal ada
    const proposal = await prisma.proposalFreelance.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }, // Include data user
    });

    if (!proposal) {
      throw new CustomError(404, "Proposal not found");
    }

    // Update status proposal
    const updatedProposal = await prisma.proposalFreelance.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // Jika status APPROVED, update role user menjadi FREELANCE
    if (status === "diterima") {
      await prisma.user.update({
        where: { id: proposal.userId },
        data: { role: "FREELANCER" },
      });
    }

    return res.status(200).json({
      status: true,
      message: "Proposal status updated successfully",
      data: updatedProposal,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProposalByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new CustomError(404, "User not found");
    }

    // Ambil proposal user
    const proposal = await prisma.proposalFreelance.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!proposal) {
      throw new CustomError(404, "Proposal not found for this user");
    }

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved proposal",
      data: proposal,
    });
  } catch (err) {
    next(err);
  }
};
