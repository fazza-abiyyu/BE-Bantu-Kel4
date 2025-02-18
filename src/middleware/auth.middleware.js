const jwt = require('jsonwebtoken');
const JwtService = require('../utils/jwt.service');
const RefreshTokenModel = require('../models/refreshToken.model');
const UserModel = require('../models/user.model');
const { isBlacklisted } = require('../utils/blacklistedToken.service');

const excludedRoutes = ['/api/auth/register', '/api/auth/login', '/api/auth/refresh-token'];

const authMiddleware = async (req, res, next) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }

    const authorizationHeader = req.headers['authorization'];
    const refreshToken = req.cookies['refresh_token'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (isBlacklisted(accessToken)) {
        return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }

    try {
        const decodedToken = JwtService.decodeAccessToken(accessToken);

        const user = await UserModel.getUserById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            if (refreshToken) {
                const validRefreshToken = await RefreshTokenModel.getRefreshToken(refreshToken);
                if (!validRefreshToken) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
                }

                const newTokens = JwtService.generateToken({ userId: validRefreshToken.user_id.toString() });
                res.cookie('access_token', newTokens.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                });

                req.headers['authorization'] = `Bearer ${newTokens.accessToken}`;

                req.user = await UserModel.getUserById(validRefreshToken.user_id);
                next();
            } else {
                return res.status(401).json({ message: 'Unauthorized: Refresh token is missing' });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized: Invalid access token' });
        }
    }
};

module.exports = authMiddleware;
