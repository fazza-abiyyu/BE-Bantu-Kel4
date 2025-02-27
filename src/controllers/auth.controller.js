const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const RefreshTokenModel = require("../models/refreshToken.model");
const JwtService = require("../utils/jwt.service");
const { addToBlacklist } = require("../utils/blacklistedToken.service");

exports.register = async (req, res) => {
  const { email, password ,fullname} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.createUser({
      email,
      password: hashedPassword,
      fullname,
      role: "USER",
    });
    res.json({ message: "Pendaftaran akun berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }
    const tokens = JwtService.generateToken({
      userId: user.id,
      role: user.role,
    });
    await RefreshTokenModel.create(user.id, tokens.refreshToken);

    JwtService.sendRefreshToken(res, tokens.refreshToken);
    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const response = {
      email: user.email,
      role: user.role,
      accessToken: tokens.accessToken,
    };

    return res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      return res.status(400).json({
        message: "Tidak ada refresh token yang ditemukan dalam cookie.",
      });
    }

    const storedToken = await RefreshTokenModel.findToken(refreshToken);
    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    let decoded;
    try {
      decoded = JwtService.decodeRefreshToken(refreshToken);
    } catch (error) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const user = await UserModel.getUserById(decoded.userId);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Pengguna tidak valid dengan refresh token." });
    }

    // Generate new access token
    const accessToken = JwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({
      message: "Token akses baru berhasil dibuat!",
      access_token: accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];
    if (!accessToken) {
      return res.status(401).json({ message: "Access token tidak ada" });
    }

    const decodedToken = JwtService.decodeAccessToken(accessToken);
    if (!decodedToken) {
      return res.status(401).json({ message: "Access token tidak valid" });
    }

    await RefreshTokenModel.deleteTokenByUserId(decodedToken.userId);

    addToBlacklist(accessToken);

    JwtService.deleteRefreshToken(res);
    JwtService.deleteAccessToken(res);

    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    return res
      .status(500)
      .json({ statusMessage: "Internal Server Error", error: error.message });
  }
};
