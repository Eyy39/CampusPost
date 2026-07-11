const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AcademicInformation = sequelize.define('AcademicInformation', {
  academic_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  high_school: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  graduation_year: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  gpa: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  grade: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  study_program: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  english_proficiency: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  awards: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'AcademicInformation',
  timestamps: false,
});

module.exports = AcademicInformation;
