const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

exports.createLowongan = async (req, res, next) => {
  try {
    const { judul, deskripsi } = req.body;
    const companyId = req.company.id;
    if (!judul || !deskripsi) {
      throw new CustomError(400, "The Input provided is not valid");
    }
    // Find Id Perusahaan
    const company = await prisma.perusahaan.findFirst({
      where: {
        id: Number(companyId),
      },
    });

    // check is companys exist
    if (!company) {
      throw new CustomError(409, "Company dont exists");
    }

    // create lowongan
    const lowongan = await prisma.lowongan.create({
      data: {
        judul,
        deskripsi,
        perusahaanId: companyId,
      },
    });

    res.status(200).json({
      status: true,
      message: "Lowongan create successfulyy",
      data: lowongan,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllLowongan = async (req, res, next) => {
  try {
    const lowongan = await prisma.lowongan.findMany({
      include: {
        perusahaan: {
          select: {
            nama_perusahaan: true,
            alamat: true,
            gambar_perusahaan: true,
          },
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "Succes to Get All Data Lowongan",
      data: lowongan,
    });
  } catch (err) {
    next(err);
  }
};

exports.editLowongan = async (req, res, next) => {
  try {
    const { judul, deskripsi, status } = req.body;
    const companyId = req.company.id;
    const lowonganId = req.params.lowonganId;
    if (!judul || !deskripsi || !status) {
      throw new CustomError(400, "The Input provided is not valid");
    }

    if (!lowonganId) {
      throw new CustomError(400, "lowongan Id Not Found");
    }

    let lowongan = await prisma.lowongan.findUnique({
      where: {
        id: Number(lowonganId),
      },
    });

    if (!lowongan) {
      throw new CustomError(404, "lowongan is not found");
    }

    // check the creator lowongan
    if (lowongan.perusahaanId != companyId) {
      throw new CustomError(
        403,
        "this company not given permision acces this resource"
      );
    }

    const updateLowongan = await prisma.lowongan.update({
      where: {
        id: Number(lowonganId),
      },
      data: {
        judul,
        deskripsi,
        status,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Succes Update lowongan",
      data: updateLowongan,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteLowongan = async (req, res, next) => {
  try {
    const lowonganId = req.params.lowonganId;
    const companyId = req.company.id;

    let lowongan = await prisma.lowongan.findUnique({
      where: {
        id: lowonganId,
      },
    });

    if (!lowongan) {
      throw new CustomError(404, "lowongan is not found");
    }

    // check the creator lowongan
    if (lowongan.perusahaanId != companyId) {
      throw new CustomError(
        403,
        "this company not given permision acces this resource"
      );
    }

    const deleteLowongan = await prisma.lowongan.delete({
      where: {
        id: lowonganId,
      },
    });

    return res.status(200).json({
      status: true,
      message: "succes delete lowongan",
      data: deleteLowongan,
    });
  } catch (err) {
    next(err);
  }
};
