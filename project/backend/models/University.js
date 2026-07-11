const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const University = sequelize.define('University', {
  university_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ranking: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  acceptance_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
}, {
  tableName: 'University',
  timestamps: true,
});

module.exports = University;
