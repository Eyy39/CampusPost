const sequelize = require('../config/db');

const User = require('./User');
const University = require('./University');
const Scholarship = require('./Scholarship');
const Favorite = require('./Favorite');
const Application = require('./Application');
const Review = require('./Review');

User.hasMany(Favorite, { foreignKey: 'userId' });
User.hasMany(Application, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

University.hasMany(Scholarship, { foreignKey: 'universityId' });
University.hasMany(Favorite, { foreignKey: 'universityId' });
University.hasMany(Review, { foreignKey: 'universityId' });

Scholarship.belongsTo(University, { foreignKey: 'universityId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(University, { foreignKey: 'universityId' });
Application.belongsTo(User, { foreignKey: 'userId' });
Application.belongsTo(Scholarship, { foreignKey: 'scholarshipId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(University, { foreignKey: 'universityId' });

module.exports = {
  sequelize,
  User,
  University,
  Scholarship,
  Favorite,
  Application,
  Review,
};