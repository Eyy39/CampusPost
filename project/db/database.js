require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

module.exports = sequelize;
