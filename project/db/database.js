const { Sequelize } = require("sequelize");

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { logging: false })
  : new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

module.exports = sequelize;
