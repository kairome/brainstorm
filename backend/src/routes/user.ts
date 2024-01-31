import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { UnauthorizedException } from '@/exceptions';

const router = express.Router();

router.get('', async (req: JwtRequest, res) => {
  if (!req.auth) {
    return new UnauthorizedException().throw(res);
  }

  const currentUser = await db.userCrud.getUserByEmail(req.auth.email);
  res.json(currentUser);
});

export default router;