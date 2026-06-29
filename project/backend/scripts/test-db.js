const { sequelize, Application } = require('../models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');

    const app = await Application.create({
      userId: null,
      fullName: 'Sopheak Vann',
      email: 'sopheak@example.com',
      phone: '+855 12 345 678',
      city: 'Phnom Penh',
      highSchool: 'Paragon International School',
      graduationYear: '2024',
      gpa: '3.8',
      grade: 'A',
      university: 'Cambodia Academy of Digital Technology',
      faculty: 'Institute of Digital Technology (IDT)',
      major: 'Computer Science (Software Engineering)',
      degreeLevel: "Bachelor's",
      intakeYear: '2026',
      studyMode: 'Full-time',
      status: 'pending_review',
      adminStatus: 'pending_review',
      documents: JSON.stringify({ nationalId: 'uploaded', transcript: 'uploaded' }),
    });

    console.log('INSERTED — id:', app.id);
    console.log('Full record:', JSON.stringify(app.toJSON(), null, 2));

    // Read it back
    const read = await Application.findByPk(app.id);
    console.log('\nREAD BACK — fullName:', read.fullName, '| major:', read.major);

    await sequelize.close();
  } catch (e) {
    console.error('Error:', e.message);
    if (e.parent) console.error('SQL:', e.parent.sqlMessage);
  }
}

test();
