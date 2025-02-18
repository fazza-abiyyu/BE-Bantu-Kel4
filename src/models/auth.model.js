const { prisma } = require('./../config/prisma');

class UserModel {
    static createUser(data) {
        return prisma.user.create({
            data,
        });
    }

    static getUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    static getUserById(id) {
        return prisma.user.findUnique({
            where: { id: Number(id) },
        });
    }
}

module.exports = UserModel;
