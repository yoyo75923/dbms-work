import { readFileSync } from 'fs';
import { join } from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the correct path
dotenv.config({ path: resolve(__dirname, '../../.env') });

async function initializeDatabase() {
  console.log('Attempting to connect to MySQL...');
  console.log('Using credentials:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    // Don't log the actual password
    database: process.env.DB_NAME || 'nss_iitp'
  });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log('Connected to MySQL server');
    const sqlFile = readFileSync(join(__dirname, 'init.sql'), 'utf8');
    console.log('Executing SQL file...');
    await connection.query(sqlFile);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  } finally {
    await connection.end();
  }
}

// Only run if this script is called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} 