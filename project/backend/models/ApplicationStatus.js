const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApplicationStatus = sequelize.define('ApplicationStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'ApplicationStatus',
  timestamps: false,
});

module.exports = ApplicationStatus;
