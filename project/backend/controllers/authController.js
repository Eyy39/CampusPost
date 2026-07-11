const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      role_id: 1 // Student
    });

    // Remove password from response
    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      message: "Registration successful",
      user: userData,
      role_id: userData.role_id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: "Login successful",
      token,
      user: userData,
      role_id: userData.role_id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};
exports.me = async (req, res) => {

    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] }
    });

    res.json(user);
};
exports.logout = (req, res) => {
    res.json({
        message: "Logout successful"
    });
};