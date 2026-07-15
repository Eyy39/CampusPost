const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('Auth header:', req.headers.authorization);
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('No auth header');
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log('No token in header');
      return res.status(401).json({
        message: "Token is missing"
      });
    }

    console.log('Token found, length:', token.length);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully');
    console.log('Decoded user:', decoded);

    req.user = decoded;

    User.findByPk(decoded.id, { attributes: ["user_id", "status"] })
      .then((user) => {
        console.log('User lookup result:', user ? 'Found' : 'Not found');
        if (!user) {
          console.log('User not found in DB');
          return res.status(401).json({ message: "User not found" });
        }
        console.log('User status:', user.status);
        if (user.status === "suspended") {
          console.log('User suspended');
          return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
        }
        console.log('Auth successful, calling next()');
        next();
      })
      .catch((err) => {
        console.log('Error finding user:', err.message);
        next();
      });

  } catch (error) {
    console.log('Auth error:', error.message);
    console.log('Error name:', error.name);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
