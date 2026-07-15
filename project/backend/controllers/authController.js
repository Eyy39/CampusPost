const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const imagekit = require('../config/imagekit');

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

    // Create JWT token so user is auto-logged in after signup
    const token = jwt.sign(
      { id: user.user_id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
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

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      console.log(`Login attempt failed: user not found for email ${email}`);
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support."
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Login attempt failed: password mismatch for user ${user.user_id} (${email})`);
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
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { first_name, last_name, phone, password } = req.body;
    const updates = { first_name, last_name, phone };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    await user.update(updates);
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update profile" });
  }
};
exports.logout = (req, res) => {
    res.json({
        message: "Logout successful"
    });
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `profile_${user.user_id}_${Date.now()}`,
      folder: "campuspost/profiles"
    });
    await user.update({ profile_picture: result.url });
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};