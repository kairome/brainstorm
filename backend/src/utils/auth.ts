import jwt from 'jsonwebtoken';
import { JWT_TTL, SECRET_KEY } from '@/config';

export const generateToken = (email: string, userId: string) => {
  return jwt.sign({
    userId,
  }, SECRET_KEY, { expiresIn: JWT_TTL });
};