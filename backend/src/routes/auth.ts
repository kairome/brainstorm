import bcrypt from 'bcrypt';
import db from '@/db';
import express from 'express';

import { generateToken } from '@/utils/auth';
import { BadRequestException, ValidationException } from '@/exceptions';
import { validateLoginData, validateRegData } from '@/utils/validations';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  const validationErrors = await validateRegData(req.body);

  if (validationErrors) {
    return new ValidationException(validationErrors).throw(res);
  }

  const { password, name, email } = req.body;

  const user = await db.userCrud.getUserByEmail(email);

  if (user) {
    return new BadRequestException({ message: 'Email is invalid' }).throw(res);
  }

  const passHash = await bcrypt.hash(password, 10);
  const newUser = await db.userCrud.createUser({ name, email, passwordHash: passHash });

  res.json({
    token: generateToken(email, String(newUser.insertedId)),
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const validationErrors = await validateLoginData(req.body);

  if (validationErrors) {
    return new ValidationException(validationErrors).throw(res);
  }

  const user = await db.userCrud.getOne({ email });

  const wrongDataException = new BadRequestException({ message: 'Wrong email or password' });

  if (!user) {
    return wrongDataException.throw(res);
  }

  const passIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passIsValid) {
    return wrongDataException.throw(res);
  }

  res.json({
    token: generateToken(user.email, user._id),
  });
}));

export default router;