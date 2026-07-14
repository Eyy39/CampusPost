require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const universityRoutes = require("./routes/universities");
const scholarshipRoutes = require("./routes/scholarships");
const favoriteRoutes = require("./routes/favorites");
const applicationRoutes = require("./routes/applications");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");
const universityAdminRoutes = require("./routes/universityAdmin");
const uploadRoutes = require("./routes/upload");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "CampusPost backend is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", (req, res) => {
  res.json({
    message: "CampusPost API",
    endpoints: [
      "/health",
      "/api/auth",
      "/api/users",
      "/api/universities",
      "/api/scholarships",
      "/api/favorites",
      "/api/applications",
      "/api/reviews",
      "/api/admin",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/university-admin", universityAdminRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next)=> {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});
const port = process.env.PORT || 3000;

async function ensureUserColumns(queryInterface) {
  const [columns] = await sequelize.query(
    "SHOW COLUMNS FROM `User`"
  );
  const colNames = columns.map(c => c.Field);

  if (!colNames.includes('university_id')) {
    console.log('Adding university_id column to User table...');
    await sequelize.query('ALTER TABLE `User` ADD COLUMN `university_id` INT NULL');
  }
  if (!colNames.includes('status')) {
    console.log('Adding status column to User table...');
    await sequelize.query("ALTER TABLE `User` ADD COLUMN `status` ENUM('active','suspended') NOT NULL DEFAULT 'active'");
  }
}

async function start() {
  try {
    await sequelize.ensureDatabase();
    await sequelize.authenticate();
    console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);
    await sequelize.sync();
    await sequelize.sync({ alter: true });
    await ensureUserColumns();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

start();

module.exports = app;
