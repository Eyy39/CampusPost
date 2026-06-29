const mysql = require('mysql2/promise');

async function migrate() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Eyy123',
    database: 'campuspost_db',
  });

  const newCols = [
    'ADD COLUMN refNo VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN adminStatus VARCHAR(255) NOT NULL DEFAULT "pending_review"',
    'ADD COLUMN adminNote TEXT DEFAULT NULL',
    'ADD COLUMN fullName VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN gender VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN dateOfBirth DATE DEFAULT NULL',
    'ADD COLUMN email VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN phone VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN city VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN address TEXT DEFAULT NULL',
    'ADD COLUMN highSchool VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN graduationYear VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN gpa VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN grade VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN studyProgram VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN englishProficiency VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN awards TEXT DEFAULT NULL',
    'ADD COLUMN university VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN faculty VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN major VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN degreeLevel VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN intakeYear VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN studyMode VARCHAR(255) DEFAULT NULL',
    'ADD COLUMN documents JSON DEFAULT NULL',
    'ADD COLUMN photo TEXT DEFAULT NULL',
  ];

  for (const col of newCols) {
    try {
      await c.execute('ALTER TABLE Applications ' + col);
      console.log('OK: ' + col.substring(0, 60));
    } catch (e) {
      if (e.message.includes('Duplicate column')) {
        console.log('Exists: ' + col.substring(0, 60));
      } else {
        console.error('FAIL: ' + e.message);
      }
    }
  }

  const [cols] = await c.execute('SHOW COLUMNS FROM Applications');
  console.log('\nTotal columns: ' + cols.length);
  console.log('Columns: ' + cols.map((c) => c.Field).join(', '));
  await c.end();
}

migrate().catch(console.error);
