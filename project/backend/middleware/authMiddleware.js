const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    User.findByPk(decoded.id, { attributes: ["user_id", "status"] })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
        if (user.status === "suspended") {
          return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
        }
        next();
      })
      .catch(() => {
        next();
      });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
