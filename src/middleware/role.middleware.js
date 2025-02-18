const jwt = require('jsonwebtoken');
const JwtService = require('../utils/jwt.service');
const Role = require('../utils/role.enum');

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const accessToken = req.cookies['access_token'];

        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: Access token is missing' });
        }

        try {
            const decodedToken = JwtService.decodeAccessToken(accessToken);

            if (!decodedToken || !allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: 'Unauthorized: User does not have access to this resource' });
            }

            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid access token' });
        }
    };
};

module.exports = roleMiddleware;
