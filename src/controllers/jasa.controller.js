const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

// CREATE: Membuat jasa baru
exports.createJasa = async (req, res, next) => {
  try {
    const { nama, deskripsi, harga_min, harga_max, bidangId } = req.body;

    // Validasi input
    if (!nama || !bidangId) {
      throw new CustomError(400, "Nama and bidangId are required");
    }

    // Cek apakah bidang dengan bidangId ada
    const bidang = await prisma.bidang.findUnique({
      where: { id: parseInt(bidangId) },
    });

    if (!bidang) {
      throw new CustomError(404, "Bidang not found");
    }
    console.log(req.user.userId);
    // Buat jasa baru
    const jasa = await prisma.jasa.create({
      data: {
        nama,
        deskripsi,
        harga_min: parseInt(harga_min),
        harga_max: parseFloat(harga_max),
        bidang: { connect: { id: parseInt(bidangId) } },
        user: { connect: { id: parseInt(req.user.userId) } },
      },
    });

    return res.status(201).json({
      status: true,
      message: "Jasa created successfully",
      data: jasa,
    });
  } catch (err) {
    next(err);
  }
};

// READ: Mendapatkan semua jasa
exports.getAllJasa = async (req, res, next) => {
  try {
    const semuaJasa = await prisma.jasa.findMany({
      include: { bidang: true }, // Include data bidang yang terkait
    });

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved all jasa",
      data: semuaJasa,
    });
  } catch (err) {
    next(err);
  }
};

// READ: Mendapatkan jasa berdasarkan ID
exports.getJasaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jasa = await prisma.jasa.findUnique({
      where: { id: parseInt(id) },
      include: { bidang: true }, // Include data bidang yang terkait
    });

    if (!jasa) {
      throw new CustomError(404, "Jasa not found");
    }

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved jasa",
      data: jasa,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE: Mengupdate jasa berdasarkan ID
exports.updateJasa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, harga_min, harga_max, bidangId } = req.body;

    // Cek apakah jasa dengan ID tersebut ada
    const jasa = await prisma.jasa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!jasa) {
      throw new CustomError(404, "Jasa not found");
    }

    // Cek apakah bidang dengan bidangId ada (jika bidangId diupdate)
    if (bidangId) {
      const bidang = await prisma.bidang.findUnique({
        where: { id: parseInt(bidangId) },
      });

      if (!bidang) {
        throw new CustomError(404, "Bidang not found");
      }
    }

    // Update jasa
    const updatedJasa = await prisma.jasa.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        deskripsi,
        harga_min,
        harga_max,
        bidang: bidangId ? { connect: { id: parseInt(bidangId) } } : undefined,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Jasa updated successfully",
      data: updatedJasa,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE: Menghapus jasa berdasarkan ID
exports.deleteJasa = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek apakah jasa dengan ID tersebut ada
    const jasa = await prisma.jasa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!jasa) {
      throw new CustomError(404, "Jasa not found");
    }

    // Hapus jasa
    await prisma.jasa.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: true,
      message: "Jasa deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
