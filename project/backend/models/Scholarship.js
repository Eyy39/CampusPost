const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Scholarship = sequelize.define('Scholarship', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	amount: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: true,
	},
	deadline: {
		type: DataTypes.DATEONLY,
		allowNull: true,
	},
	universityId: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});

module.exports = Scholarship;
