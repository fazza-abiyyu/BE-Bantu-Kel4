const prisma = require("./../config/prisma");

class UserModel {
  static createUser(data) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        user_profile: {
          create: {
            full_name: data.fullname,
          },
        },
      },
    });
  }

  static getUserById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        user_profile: true,
        refresh_token: true,
        log: true,
      },
    });
  }

  static getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        user_profile: true,
        refresh_token: true,
        log: true,
      },
    });
  }

  static updateUser(id, data) {
    return prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  }

  static deleteUser(id) {
    return prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  static getUsers(payload) {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      skip: payload.skip,
      take: payload.itemsPerPage,
    });
  }
}

module.exports = UserModel;
