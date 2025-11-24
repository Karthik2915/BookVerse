
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

  try {
    const connection = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
    await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.changeUser({ database: DB_NAME });

    const queries = sql.split(';').filter(query => query.trim() !== '');
    for (const query of queries) {
      await connection.query(query);
    }

    console.log('Database initialized successfully.');
    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
})();
