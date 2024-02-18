import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { UnauthorizedException } from '@/exceptions';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  if (!req.auth) {
    return new UnauthorizedException().throw(res);
  }

  const currentUser = await db.userCrud.getUserById(req.auth.userId);
  res.json(currentUser);
}));

export default router;