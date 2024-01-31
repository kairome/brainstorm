import dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DB_CONNECTION = process.env.DB_CONNECTION ?? '';

export const SECRET_KEY = process.env.SECRET_KEY ?? randomBytes(20).toString('hex')

export const JWT_TTL = process.env.JWT_TTL ?? '1h';