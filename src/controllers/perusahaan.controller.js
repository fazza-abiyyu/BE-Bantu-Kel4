const path = require("path");
const bcrypt = require("bcrypt");
const imagekit = require("../libs/imagekit");
const prisma = require("../config/prisma");
const JwtService = require("../utils/jwt.service");
const { CustomError } = require("../utils/errorHandler");

exports.registerPerusahaan = async (req, res, next) => {
  try {
    let { email, password, nama_perusahaan } = req.body;
    let file = req.file;
    let imageURL;
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // validate requred fields
    if (!email || !password || !nama_perusahaan)
      throw new CustomError(400, "All fields are required.");
    const existingCompany = await prisma.perusahaan.findFirst({
      where: {
        email: email,
      },
    });

    if (existingCompany) {
      throw new CustomError(409, "Email or phone number already exists");
    }

    if (!emailValidator.test(email))
      throw new CustomError(400, "Invalid email Format");

    const hashedPassword = await bcrypt.hash(password, 10);
    // Handle File Upload
    if (file) {
      const strFile = file.buffer.toString("base64");
      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });
      imageURL = url;
    } else {
      throw new CustomError(400, "Image Must Upload");
    }
    let newCompany = await prisma.perusahaan.create({
      data: {
        email,
        password: hashedPassword,
        nama_perusahaan,
        gambar_perusahaan: imageURL,
      },
    });

    res.status(201).json({
      status: true,
      message: "Registration Company successful",
      data: newCompany,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginPerusahaan = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      throw new CustomError(400, "All fields are required.");

    const company = await prisma.perusahaan.findUnique({
      where: {
        email,
      },
    });
    if (!company) {
      throw new CustomError(404, "Company Not Found");
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      throw new CustomError(404, "Email or Password Not Valid");
    }
    const tokens = JwtService.generateToken({ companyId: company.id });
    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const response = {
      email: company.email,
      company: company.nama_perusahaan,
      accessToken: tokens.accessToken,
    };

    return res.status(200).json({
      status: true,
      message: "login Company successful",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.editPerusahaan = async (req, res, next) => {
  try {
    let { email, nama_perusahaan } = req.body;
    const companyId = req.company.id;
    let file = req.file;
    let imageURL;
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate : Check if the userId is a valid number
    if (isNaN(companyId)) throw new CustomError(400, "Invalid companyId");

    // validate requred fields
    if (!email || !nama_perusahaan)
      throw new CustomError(400, "All fields are required.");

    if (!emailValidator.test(email))
      throw new CustomError(400, "Invalid email Format");
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

    // check image already exist
    if (file) {
      const strFile = file.buffer.toString("base64");
      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });
      imageURL = url;
      company.gambar_perusahaan = imageURL;
    }

    // prepare upadate data
    const updateData = { ...company, ...req.body };
    const updateCompant = await prisma.perusahaan.update({
      where: {
        id: Number(companyId),
      },
      data: updateData,
    });

    res.status(200).json({
      status: true,
      message: "Company update successfulyy",
      data: updateCompant,
    });
  } catch (err) {
    next(err);
  }
};
