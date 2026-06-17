const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const University = sequelize.define('University', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	country: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	city: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	ranking: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});

module.exports = University;
