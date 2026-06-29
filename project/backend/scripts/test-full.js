const http = require('http');
const { sequelize } = require('../models');

async function main() {
  // Test direct DB insert first
  const { Application } = require('../models');
  try {
    const app = await Application.create({
      userId: 1,
      fullName: 'Sopheak Vann',
      email: 'sopheak@example.com',
      university: 'CADT',
      major: 'CS',
    });
    console.log('DB insert OK, id:', app.id);
  } catch (e) {
    console.error('DB insert error:', e.message, e.parent?.sqlMessage);
  }

  // Test API endpoint
  const data = JSON.stringify({
    userId: 1,
    fullName: 'Sopheak Vann',
    email: 'sopheak@example.com',
  });

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/applications',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('API status:', res.statusCode);
      console.log('API response:', body);
      process.exit(0);
    });
  });
  req.on('error', (e) => { console.error('API error:', e.message); process.exit(1); });
  req.write(data);
  req.end();
}

main();
