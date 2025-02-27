const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

exports.applyLowongan = async (req, res, next) => {
  try {
    const { perusahaanId, pengalaman, lowonganId } = req.body;
    const file = req.file;
    const { userId } = req.user;
    let fileUrl = null;
    const uniqueCode = req.uniqueCode;

    if (!perusahaanId || !pengalaman || !lowonganId) {
      throw new CustomError(400, "The Input provided is not valid");
    }

    if (file) {
      fileUrl = `/api/docs/${uniqueCode}-${file.originalname.replace(/\s+/g, "-")}`;
    } else {
      throw new CustomError(400, "File Cv must be Upload");
    }
    // check is lowongan is open
    const { status } = await prisma.lowongan.findUnique({
      where: {
        id: Number(lowonganId),
      },
      select: {
        status: true,
      },
    });

    if (status != "open") {
      return res.status(200).json({
        status: true,
        messgae: "lowongan sudah tutup",
      });
    }

    // check the user alredy apply or not

    const applyCheck = await prisma.lamaran.findFirst({
      where: {
        userId,
        AND: {
          lowonganId: Number(lowonganId),
        },
      },
    });

    if (applyCheck) {
      throw new CustomError("409", "You have already applied for this job.");
    }

    // membuat lamaran
    const applyLowongan = await prisma.lamaran.create({
      data: {
        userId,
        pengalaman,
        cv_file: fileUrl,
        lowonganId: Number(lowonganId),
        perusahaanId: Number(perusahaanId),
      },
    });

    res.status(200).json({
      status: true,
      message: "Succes to Apply a Job",
      data: applyLowongan,
    });
  } catch (err) {
    next(err);
  }
};

exports.lamaranPerusahaan = async (req, res, next) => {
  try {
    const perusahaanId = req.company.id;
    const { lowonganId } = req.params;

    // find lowongan Id

    let lowongan = await prisma.lowongan.findMany({
      where: {
        id: Number(lowonganId),
        AND: {
          perusahaanId: perusahaanId,
        },
      },
      include: {
        lamaran: {
          select: {
            cv_file: true,
            pengalaman: true,
            User: {
              select: {
                user_profile: true,
              },
            },
          },
        },
      },
    });

    if (!lowongan) {
      throw new CustomError(404, "lowongan not found");
    }

    return res.status(200).json({
      status: true,
      message: "Succes to show user apply job",
      data: lowongan,
    });
  } catch (err) {
    next(err);
  }
};

exports.editLamaran = async (req, res, next) => {
  try {
    // hasil edit nya ditolak atau diterima
    // hasil akan masuk dalam notofikasi user

    const perusahaanId = req.company.id;
    const { status, lamaranId } = req.body;
    let message = "";
    // check status is exist

    if (!status || !lamaranId) {
      throw new CustomError(400, "The Input provided is not valid");
    }
    // check status apply job

    let applyJob = await prisma.lamaran.findUnique({
      where: {
        id: Number(lamaranId),
      },
      include: {
        perusahaan: {
          select: {
            nama_perusahaan: true,
          },
        },
        lowongan: {
          select: {
            judul: true,
          },
        },
      },
    });

    if (!applyJob) {
      throw new CustomError(404, "Invalid Not Found Apply Job");
    }

    if (applyJob.perusahaanId != perusahaanId) {
      throw new CustomError(400, "Cant Acces this Resource");
    }
    // update status applyJob

    if (status == "diterima") {
      message = `Selamat lamaran anda di posisi ${applyJob.lowongan.judul} di perusahaan ${applyJob.perusahaan.nama_perusahaan} telah ${status} ,silahkan menghubungi nomor perusahaan untuk lebih lanjut`;
    } else {
      message = `Tetap Semangat lamaran anda di posisi ${applyJob.lowongan.judul} di perusahaan ${applyJob.perusahaan.nama_perusahaan} telah ${status} ,silahkan menghubungi nomor perusahaan untuk lebih lanjut`;
    }

    // create notification to show the user
    await prisma.notif.create({
      data: {
        deskripsi: message,
        jenis: "STATUS_LAMARAN",
        userId: applyJob.userId,
      },
    });

    applyJob = await prisma.lamaran.update({
      where: {
        id: Number(lamaranId),
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      status: true,
      message: "succces to update apply Job",
      data: applyJob,
    });
  } catch (err) {
    next(err);
  }
};
