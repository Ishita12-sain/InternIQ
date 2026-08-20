import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Search candidate .env paths whether running from root, backend, or dist
const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173'),

  JWT_SECRET: z
    .string()
    .min(1, 'JWT_SECRET is required'),

  JWT_EXPIRES_IN: z
    .string()
    .default('7d'),

  DATABASE_URL: z
    .string()
    .optional(),

  DB_HOST: z.string().optional(),
  DB_PORT: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables:',
    parsedEnv.error.format()
  );
  process.exit(1);
}

export const config = {
  port: parsedEnv.data.PORT,
  nodeEnv: parsedEnv.data.NODE_ENV,
  corsOrigin: parsedEnv.data.CORS_ORIGIN,

  jwtSecret: parsedEnv.data.JWT_SECRET,
  jwtExpiresIn: parsedEnv.data.JWT_EXPIRES_IN,

  databaseUrl: parsedEnv.data.DATABASE_URL,
  dbHost: parsedEnv.data.DB_HOST,
  dbPort: parsedEnv.data.DB_PORT,
  dbName: parsedEnv.data.DB_NAME,
  dbUser: parsedEnv.data.DB_USER,
  dbPassword: parsedEnv.data.DB_PASSWORD,

  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isTest: parsedEnv.data.NODE_ENV === 'test',
} as const;

export default config;