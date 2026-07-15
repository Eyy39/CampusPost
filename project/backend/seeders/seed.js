require('dotenv').config({ path: '../.env' });
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { sequelize, Role, User, University, Major, Scholarship, Application, ApplicationStatus, ApplicantProfile, AcademicInformation, Review, Comment } = require('../models');

const USER_COUNT = 1500;
const APPLICATION_COUNT = 7500;

async function seedRoles() {
  console.log('Seeding roles...');
  await Role.bulkCreate([
    { role_name: 'user' },
    { role_name: 'admin' },
    { role_name: 'system_admin' },
  ], { ignoreDuplicates: true });
  console.log('Roles seeded');
}

async function seedApplicationStatuses() {
  console.log('Seeding application statuses...');
  await ApplicationStatus.bulkCreate([
    { status_name: 'Pending' },
    { status_name: 'Approved' },
    { status_name: 'Rejected' },
  ], { ignoreDuplicates: true });
  console.log('Application statuses seeded');
}

async function seedUsers() {
  console.log(`Seeding ${USER_COUNT} users...`);
  const roles = await Role.findAll();
  const universities = await University.findAll();

  const studentRole = roles.find(r => r.role_name === 'user');
  const adminRole = roles.find(r => r.role_name === 'admin');
  const uniAdminRole = roles.find(r => r.role_name === 'system_admin');

  if (!studentRole || !adminRole || !uniAdminRole) {
    throw new Error('Roles not found. Make sure seedRoles() ran first.');
  }

  console.log('Keeping existing users, adding new seeded users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const role = faker.helpers.arrayElement([
      { role: studentRole, weight: 90 },
      { role: adminRole, weight: 5 },
      { role: uniAdminRole, weight: 5 },
    ]).role;

    const universityId = role === uniAdminRole
      ? faker.helpers.arrayElement(universities.map(u => u.university_id))
      : null;

    users.push({
      role_id: role.role_id,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: passwordHash,
      phone: faker.phone.number(),
      university_id: universityId,
      status: faker.helpers.arrayElement(['active', 'active', 'active', 'suspended']),
    });
  }

  await User.bulkCreate(users, { ignoreDuplicates: true });
  console.log(`${USER_COUNT} users seeded`);
}

async function seedApplications() {
  console.log(`Seeding ${APPLICATION_COUNT} applications...`);
  const roles = await Role.findAll();
  const studentRole = roles.find(r => r.role_name === 'user');
  const users = await User.findAll({ where: { role_id: studentRole.role_id } });
  const universities = await University.findAll();
  const majors = await Major.findAll();
  const scholarships = await Scholarship.findAll();
  const statuses = await ApplicationStatus.findAll();

  if (users.length === 0 || universities.length === 0 || majors.length === 0 || statuses.length === 0) {
    throw new Error('Missing reference data. Make sure universities, majors, and statuses exist.');
  }

  const applications = [];
  for (let i = 0; i < APPLICATION_COUNT; i++) {
    const user = faker.helpers.arrayElement(users);
    const university = faker.helpers.arrayElement(universities);
    const universityMajors = majors.filter(m => m.university_id === university.university_id);
    const major = universityMajors.length > 0
      ? faker.helpers.arrayElement(universityMajors)
      : faker.helpers.arrayElement(majors);

    const universityScholarships = scholarships.filter(s => s.university_id === university.university_id);
    const scholarship = universityScholarships.length > 0 && faker.datatype.boolean(0.3)
      ? faker.helpers.arrayElement(universityScholarships)
      : null;

    const status = faker.helpers.arrayElement(statuses);

    applications.push({
      user_id: user.user_id,
      university_id: university.university_id,
      major_id: major.major_id,
      scholarship_id: scholarship ? scholarship.scholarship_id : null,
      status_id: status.status_id,
      ref_no: faker.string.alphanumeric(10).toUpperCase(),
      admin_status: faker.helpers.arrayElement(['pending', 'approved', 'rejected', null]),
      admin_note: faker.datatype.boolean(0.2) ? faker.lorem.sentence() : null,
    });
  }

  const createdApplications = await Application.bulkCreate(applications, { ignoreDuplicates: true });
  console.log(`${APPLICATION_COUNT} applications seeded`);
  return createdApplications;
}

async function seedApplicantProfiles(applications) {
  console.log('Seeding applicant profiles...');
  const profiles = applications.map(app => ({
    application_id: app.application_id,
    full_name: faker.person.fullName(),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    date_of_birth: faker.date.between({ from: '2000-01-01', to: '2006-12-31' }).toISOString().split('T')[0],
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    city: faker.location.city(),
    address: faker.location.streetAddress(),
    photo: null,
  }));

  await ApplicantProfile.bulkCreate(profiles, { ignoreDuplicates: true });
  console.log(`${profiles.length} applicant profiles seeded`);
}

async function seedAcademicInformation(applications) {
  console.log('Seeding academic information...');
  const academics = applications.map(app => ({
    application_id: app.application_id,
    high_school: faker.company.name() + ' High School',
    graduation_year: faker.helpers.arrayElement(['2022', '2023', '2024', '2025']),
    gpa: faker.number.float({ min: 2.5, max: 4.0, fractionDigits: 2 }).toFixed(2),
    grade: faker.helpers.arrayElement(['A', 'B+', 'B', 'C+', 'C']),
    study_program: faker.helpers.arrayElement(['Science', 'Arts', 'Commerce', 'Engineering']),
    english_proficiency: faker.helpers.arrayElement(['IELTS 6.5', 'TOEFL 80', 'Native', 'Intermediate']),
    awards: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
  }));

  await AcademicInformation.bulkCreate(academics, { ignoreDuplicates: true });
  console.log(`${academics.length} academic records seeded`);
}

async function seedReviews() {
  console.log('Seeding reviews...');
  const roles = await Role.findAll();
  const studentRole = roles.find(r => r.role_name === 'user');
  const users = await User.findAll({ where: { role_id: studentRole.role_id } });
  const universities = await University.findAll();

  const reviews = [];
  for (let i = 0; i < 3000; i++) {
    const user = faker.helpers.arrayElement(users);
    const university = faker.helpers.arrayElement(universities);

    reviews.push({
      user_id: user.user_id,
      university_id: university.university_id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
    });
  }

  const createdReviews = await Review.bulkCreate(reviews);
  console.log(`${createdReviews.length} reviews seeded`);
  return createdReviews;
}

async function seedComments(reviews) {
  console.log('Seeding comments...');
  const roles = await Role.findAll();
  const studentRole = roles.find(r => r.role_name === 'user');
  const users = await User.findAll({ where: { role_id: studentRole.role_id } });

  const comments = [];
  for (let i = 0; i < 4500; i++) {
    const review = faker.helpers.arrayElement(reviews);
    const user = faker.helpers.arrayElement(users);

    comments.push({
      review_id: review.review_id,
      user_id: user.user_id,
      content: faker.lorem.sentence(),
    });
  }

  await Comment.bulkCreate(comments);
  console.log(`${comments.length} comments seeded`);
}

async function run() {
  try {
    await sequelize.ensureDatabase();
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync();

    await seedRoles();
    await seedApplicationStatuses();
    await seedUsers();
    const applications = await seedApplications();
    await seedApplicantProfiles(applications);
    await seedAcademicInformation(applications);
    const reviews = await seedReviews();
    await seedComments(reviews);

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

run();
