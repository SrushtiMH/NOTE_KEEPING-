const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',       // Your MySQL password here
  database: 'notekeeper',
  ssl: false          // Disable SSL to fix WRONG_VERSION_NUMBER error
});

module.exports = db;
