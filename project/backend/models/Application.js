const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scholarship_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  major_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ref_no: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  admin_status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  admin_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Application',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['user_id', 'university_id', 'major_id'] },
  ],
});

module.exports = Application;
