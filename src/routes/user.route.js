const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const roleMiddleware = require('../middleware/role.middleware');
const Role = require('../utils/role.enum');

router.get('/users', roleMiddleware(Role.ADMIN), userController.getAllUsers);
router.get('/users/:id', roleMiddleware(Role.ADMIN, Role.FREELANCER), userController.getUserById);
router.post('/users', roleMiddleware(Role.ADMIN), userController.createUser);
router.put('/users/:id', roleMiddleware(Role.ADMIN), userController.updateUser);
router.delete('/users/:id', roleMiddleware(Role.ADMIN), userController.deleteUser);

module.exports = router;
