const http = require('http');

const data = JSON.stringify({
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
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
