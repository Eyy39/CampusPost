const http = require('http');

const data = JSON.stringify({
  fullName: 'Test API User',
  email: 'testapi@example.com',
  university: 'Institute of Technology of Cambodia',
  major: 'Software Engineering',
  status: 'pending',
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
    const parsed = JSON.parse(body);
    console.log('Created ID:', parsed.id);
    console.log('Full name:', parsed.fullName);
    console.log('Major:', parsed.major);
    process.exit(0);
  });
});
req.on('error', (e) => { console.error('Failed:', e.message); process.exit(1); });
req.write(data);
req.end();
