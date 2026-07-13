const { User, Role, University } = require('../models');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Role, attributes: ['role_name'] },
        { model: University, as: 'AssignedUniversity', attributes: ['university_id', 'name'], required: false },
      ],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('List users error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to load users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { password, confirmPassword, ...rest } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...rest, password: hashedPassword });
    const userData = user.toJSON();
    delete userData.password;
    res.status(201).json(userData);
  } catch (error) {
    console.error('Create user error:', error.message, error.stack);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ message: error.message || 'Invalid user payload' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...rest } = req.body;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ ...rest, password: hashedPassword });
    } else {
      await user.update(rest);
    }
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Update user error:', error.message, error.stack);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ message: error.message || 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};