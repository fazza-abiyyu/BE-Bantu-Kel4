const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prisma');

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class JwtService {
    static generateToken(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    static generateAccessToken(payload) {
        return jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
    }

    static decodeAccessToken(token) {
        try {
            return jwt.verify(token, accessTokenSecret);
        } catch (err) {
            console.error('Error decoding access token:', err);
            return null;
        }
    }

    static decodeRefreshToken(token) {
        try {
            return jwt.verify(token, refreshTokenSecret);
        } catch (err) {
            console.error('Error decoding refresh token:', err);
            return null;
        }
    }

    static async getUserByToken(id) {
        return prisma.user.findUnique({ where: { id: Number(id) } });
    }

    static sendRefreshToken(res, token) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/api/auth',
        });
    }

    static deleteRefreshToken(res) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/api/auth',
        });
    }

    static deleteAccessToken(res) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
    }
}

module.exports = JwtService;
