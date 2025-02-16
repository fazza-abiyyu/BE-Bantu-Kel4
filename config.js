require('dotenv').config();

module.exports = {
    databaseUrl: process.env.DATABASE_URL,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN,
    port: process.env.PORT || 3000,
};
