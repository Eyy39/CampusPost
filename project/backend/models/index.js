const sequelize = require("../config/db");

const Role = require("./Role");
const User = require("./User");
const University = require("./University");
const Major = require("./Major");
const Scholarship = require("./Scholarship");
const Favorite = require("./Favorite");
const Application = require("./Application");
const ApplicationStatus = require("./ApplicationStatus");
const ApplicantProfile = require("./ApplicantProfile");
const AcademicInformation = require("./AcademicInformation");
const ApplicationDocument = require("./ApplicationDocument");
const Review = require("./Review");
const Comment = require("./Comment");

// Role -> User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

// User -> Favorite
User.hasMany(Favorite, { foreignKey: "user_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

// User -> Application
User.hasMany(Application, { foreignKey: "user_id" });
Application.belongsTo(User, { foreignKey: "user_id" });

// User -> Review
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Review -> Comment
Review.hasMany(Comment, { foreignKey: "review_id", as: "Comments" });
Comment.belongsTo(Review, { foreignKey: "review_id" });

// User -> Comment
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

// University -> Major
University.hasMany(Major, { foreignKey: "university_id" });
Major.belongsTo(University, { foreignKey: "university_id" });

// University -> Scholarship
University.hasMany(Scholarship, { foreignKey: "university_id" });
Scholarship.belongsTo(University, { foreignKey: "university_id" });

// User -> University (university admin assignment)
User.belongsTo(University, { foreignKey: "university_id", as: "AssignedUniversity" });

// University -> Favorite
University.hasMany(Favorite, { foreignKey: "university_id" });
Favorite.belongsTo(University, { foreignKey: "university_id" });

// University -> Review
University.hasMany(Review, { foreignKey: "university_id" });
Review.belongsTo(University, { foreignKey: "university_id" });

// University -> User (university admin assignment)
University.hasMany(User, { foreignKey: "university_id", as: "Admins" });

// Application -> University
Application.belongsTo(University, { foreignKey: "university_id" });

// Application -> Major
Application.belongsTo(Major, { foreignKey: "major_id" });

// Application -> Scholarship
Application.belongsTo(Scholarship, { foreignKey: "scholarship_id" });

// Application -> ApplicationStatus
Application.belongsTo(ApplicationStatus, { foreignKey: "status_id" });
ApplicationStatus.hasMany(Application, { foreignKey: "status_id" });

// Application -> ApplicantProfile (1:1)
Application.hasOne(ApplicantProfile, {
  foreignKey: "application_id",
  as: "ApplicantProfile",
});
ApplicantProfile.belongsTo(Application, { foreignKey: "application_id" });

// Application -> AcademicInformation (1:1)
Application.hasOne(AcademicInformation, {
  foreignKey: "application_id",
  as: "AcademicInformation",
});
AcademicInformation.belongsTo(Application, { foreignKey: "application_id" });

// Application -> ApplicationDocument (1:M)
Application.hasMany(ApplicationDocument, {
  foreignKey: "application_id",
  as: "ApplicationDocuments",
});
ApplicationDocument.belongsTo(Application, { foreignKey: "application_id" });

module.exports = {
  sequelize,
  Role,
  User,
  University,
  Major,
  Scholarship,
  Favorite,
  Application,
  ApplicationStatus,
  ApplicantProfile,
  AcademicInformation,
  ApplicationDocument,
  Review,
  Comment,
};
