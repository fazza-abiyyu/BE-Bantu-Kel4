const tokenBlacklist = [];

function addToBlacklist(token) {
    tokenBlacklist.push(token);
}

function isBlacklisted(token) {
    return tokenBlacklist.includes(token);
}

module.exports = {
    addToBlacklist,
    isBlacklisted
};