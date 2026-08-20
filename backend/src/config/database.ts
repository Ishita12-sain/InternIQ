import { Pool, PoolConfig, QueryResultRow } from 'pg';
import config from './env';

interface ParsedDbConfig {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

/**
 * Robustly parses a PostgreSQL connection string, handling special
 * characters (such as '@' or symbols) in the database password.
 */
function parseDatabaseUrl(url?: string): ParsedDbConfig {
  if (!url) return {};

  try {
    const regex = /^postgres(?:ql)?:\/\/([^:]+):(.+)@([^@:\/]+)(?::(\d+))?\/(.+)$/;
    const match = url.match(regex);

    if (match) {
      return {
        user: decodeURIComponent(match[1]),
        password: decodeURIComponent(match[2]),
        host: match[3],
        port: match[4] ? parseInt(match[4], 10) : 5432,
        database: match[5]?.split('?')[0],
      };
    }

    const parsed = new URL(url);
    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 5432,
      database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined,
    };
  } catch {
    return {};
  }
}

const parsedFromUrl = parseDatabaseUrl(config.databaseUrl);

const dbUser = config.dbUser || parsedFromUrl.user || process.env.DB_USER || 'postgres';
const dbPassword = config.dbPassword || parsedFromUrl.password || process.env.DB_PASSWORD || '';
const dbHost = config.dbHost || parsedFromUrl.host || process.env.DB_HOST || 'localhost';
const dbPort = config.dbPort || parsedFromUrl.port || (process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432);
const dbName = config.dbName || parsedFromUrl.database || process.env.DB_NAME || 'internship_management';

const poolConfig: PoolConfig = {
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: String(dbPassword),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

const pool = new Pool(poolConfig);

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
    console.log(`✅ PostgreSQL database connected successfully (${dbUser}@${dbHost}:${dbPort}/${dbName})`);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL database connection failed:', error);
    return false;
  }
}

export default pool;