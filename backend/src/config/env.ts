import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from backend/.env
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

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
    .default('*'),

  JWT_SECRET: z
    .string()
    .min(1, 'JWT_SECRET is required'),

  JWT_EXPIRES_IN: z
    .string()
    .default('7d'),

  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required'),
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

  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isTest: parsedEnv.data.NODE_ENV === 'test',
} as const;

export default config;