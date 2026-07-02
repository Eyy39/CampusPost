const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApplicationDocument = sequelize.define('ApplicationDocument', {
  document_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  document_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'ApplicationDocument',
  timestamps: false,
});

module.exports = ApplicationDocument;
