const prisma = require("../config/prisma");
const { CustomError } = require("../utils/errorHandler");

exports.gettAllNotification = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new CustomError(404, "User Not Found");
    }

    // find notification user

    const notification = await prisma.notif.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        jenis: true,
        deskripsi: true,
        created_at: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Succes To Show Notification",
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};
