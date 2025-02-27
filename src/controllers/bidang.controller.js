const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

exports.createBidang = async (req, res, next) => {
  try {
    const { namaBidang } = req.body;

    if (!namaBidang) {
      throw new CustomError(400, "The Input provided is not valid");
    }

    // check bidang is exist

    let checkBidang = await prisma.bidang.findFirst({
      where: {
        nama: namaBidang,
      },
    });

    if (checkBidang) {
      throw new CustomError(400, "Bidang is exist in data");
    }

    const bidang = await prisma.bidang.create({
      data: {
        nama: namaBidang,
      },
    });
    delete bidang.userId;

    return res.status(200).json({
      status: true,
      message: "succes to create bidang",
      data: bidang,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllBidang = async (req, res, next) => {
  try {
    const allBidang = await prisma.bidang.findMany();

    if (!allBidang || allBidang.length === 0) {
      throw new CustomError(404, "No bidang data found");
    }

    return res.status(200).json({
      status: true,
      message: "Success to get all bidang data",
      data: allBidang,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBidang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { namaBidang } = req.body;

    if (!namaBidang) {
      throw new CustomError(400, "The input provided is not valid");
    }

    const checkBidang = await prisma.bidang.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkBidang) {
      throw new CustomError(404, "Bidang not found");
    }

    // Update bidang
    const updatedBidang = await prisma.bidang.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nama: namaBidang,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Success to update bidang",
      data: updatedBidang,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBidang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkBidang = await prisma.bidang.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkBidang) {
      throw new CustomError(404, "Bidang not found");
    }

    // Hapus bidang
    await prisma.bidang.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      status: true,
      message: "Success to delete bidang",
    });
  } catch (err) {
    next(err);
  }
};
