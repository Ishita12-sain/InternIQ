import { Pool, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'interniq_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  return pool.query<T>(text, params);
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL database connected');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL database connection failed:', error);
    return false;
  }
}

export default pool;