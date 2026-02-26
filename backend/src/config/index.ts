import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
}

function loadConfig(): AppConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  const databaseUrl = process.env.DATABASE_URL;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required in environment variables');
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required in environment variables');
  }

  return {
    port,
    corsOrigin,
    jwtSecret,
    jwtExpiresIn,
    databaseUrl,
  };
}

export const config = loadConfig();
