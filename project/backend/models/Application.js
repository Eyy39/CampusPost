const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  scholarshipId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  refNo: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  adminStatus: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending_review' },
  adminNote: { type: DataTypes.TEXT, allowNull: true },

  fullName: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.STRING, allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },

  highSchool: { type: DataTypes.STRING, allowNull: true },
  graduationYear: { type: DataTypes.STRING, allowNull: true },
  gpa: { type: DataTypes.STRING, allowNull: true },
  grade: { type: DataTypes.STRING, allowNull: true },
  studyProgram: { type: DataTypes.STRING, allowNull: true },
  englishProficiency: { type: DataTypes.STRING, allowNull: true },
  awards: { type: DataTypes.TEXT, allowNull: true },

  university: { type: DataTypes.STRING, allowNull: true },
  faculty: { type: DataTypes.STRING, allowNull: true },
  major: { type: DataTypes.STRING, allowNull: true },
  degreeLevel: { type: DataTypes.STRING, allowNull: true },
  intakeYear: { type: DataTypes.STRING, allowNull: true },
  studyMode: { type: DataTypes.STRING, allowNull: true },

  documents: { type: DataTypes.JSON, allowNull: true },
  photo: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = Application;
