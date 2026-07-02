const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Major = sequelize.define('Major', {
  major_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  major_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  degree_level: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tuition_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Major',
  timestamps: false,
});

module.exports = Major;
