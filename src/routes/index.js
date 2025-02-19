const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        const route = require(path.join(__dirname, file));
        router.use(route);
    }
});

module.exports = router;
