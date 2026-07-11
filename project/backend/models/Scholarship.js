const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Scholarship = sequelize.define('Scholarship', {
  scholarship_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  eligibility: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  spots: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  registration_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  programs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  exam_subjects: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tuition_table: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'Scholarship',
  timestamps: true,
});

module.exports = Scholarship;
