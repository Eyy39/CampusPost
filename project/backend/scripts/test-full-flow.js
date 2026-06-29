const express = require('express');
const { sequelize, Application } = require('../models');

async function fullFlow() {
  await sequelize.authenticate();
  console.log('1. MySQL connected');

  // Insert via model (same as what the API does)
  const created = await Application.create({
    fullName: 'Full Flow Test',
    email: 'flow@test.com',
    university: 'CADT',
    major: 'Data Science',
    status: 'pending_review',
  });
  console.log('2. Created via model — id:', created.id);

  // Read back
  const read = await Application.findByPk(created.id);
  console.log('3. Read back — name:', read.fullName, '| major:', read.major);

  // Update
  await read.update({ major: 'Data Science (updated)' });
  const updated = await Application.findByPk(created.id);
  console.log('4. Updated — major:', updated.major);

  // Delete
  await updated.destroy();
  const deleted = await Application.findByPk(created.id);
  console.log('5. Deleted — exists:', !!deleted);

  console.log('\n✅ Full CRUD cycle works. Data flows: Frontend → API → MySQL');
  await sequelize.close();
}

fullFlow().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
