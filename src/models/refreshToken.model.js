const { prisma } = require('../config/prisma');

class RefreshTokenModel {
    static create(userId, refreshToken) {
        return prisma.refreshToken.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
            },
        });
    }

    static findToken(token) {
        return prisma.refreshToken.findFirst({
            where: { refresh_token: token },
        });
    }

    static deleteToken(token) {
        return prisma.refreshToken.deleteMany({
            where: { refresh_token: token },
        });
    }

    static getToken(refreshToken) {
        return prisma.refreshToken.findFirst({
            where: {
                refresh_token: refreshToken,
            },
        });
    }
    static deleteTokenByUserId(userId) {
        return prisma.refreshToken.deleteMany({
            where: { user_id: userId },
        });
    }
}

module.exports = RefreshTokenModel;
