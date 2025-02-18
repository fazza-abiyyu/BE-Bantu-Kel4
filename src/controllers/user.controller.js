const UserModel = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getUsers({
            itemsPerPage: parseInt(req.query.itemsPerPage) || 10,
            skip: parseInt(req.query.skip) || 0,
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.getUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { email, password, role, first_name, last_name } = req.body;
    try {
        const user = await UserModel.createUser({
            email,
            password,
            role,
            user_profile: {
                create: {
                    first_name,
                    last_name,
                },
            },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, role, first_name, last_name } = req.body;
    try {
        const user = await UserModel.updateUser(id, {
            email,
            password,
            role,
            user_profile: {
                update: {
                    first_name,
                    last_name,
                },
            },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.deleteUser(id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
