import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { BadRequestException, UnauthorizedException } from '@/exceptions';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  if (!req.auth) {
    return new UnauthorizedException().throw(res);
  }

  const currentUser = await db.userCrud.getUserById(req.auth.userId);
  res.json(currentUser);
}));

router.patch('', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;

  const { name, color } = req.body;

  if ((!name || !name.trim()) && (!color || !color.trim())) {
    return new BadRequestException({ message: 'Name or color must be present' }).throw(res);
  }

  const user = await db.userCrud.getUserById(userId);

  if (!user) {
    return new BadRequestException({ message: 'User does not exist' }).throw(res);
  }

  const updateObj: { name?: string, color?: string } = {};

  if (name) {
    updateObj.name = name;
  }

  if (color) {
    updateObj.color = color;
  }

  await db.userCrud.updateUserInfo(userId, updateObj);

  if (updateObj.name) {
    await db.boardsCrud.updateBoardMemberName(user.email, name);
  }

  res.send();
}));

router.patch('/password', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const user = await db.userCrud.getUserById(userId, true);

  if (!user) {
    return new BadRequestException({ message: 'User does not exist' }).throw(res);
  }

  const { currentPassword, newPassword } = req.body;

  const passIsValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!passIsValid || !newPassword) {
    return new BadRequestException({ message: 'Password is incorrect' }).throw(res);
  }

  if (newPassword.length < 8) {
    return new BadRequestException({ message: 'New password must be at least 8 characters long' }).throw(res);
  }

  const passHash = await bcrypt.hash(newPassword, 10);
  await db.userCrud.updateUserPassHash(userId, passHash);

  res.send();
}));

router.post('/remove', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const user = await db.userCrud.getUserById(userId, true);

  if (!user) {
    return new BadRequestException({ message: 'User does not exist' }).throw(res);
  }

  const { password } = req.body;

  const passIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passIsValid) {
    return new BadRequestException({ message: 'Password is incorrect' }).throw(res);
  }

  await db.boardsCrud.removeAuthorBoards(userId);
  await db.boardsCrud.removeMemberFromAllBoards(user.email);
  await db.templatesCrud.removeAllOwnerTemplates(userId);
  await db.userCrud.deleteOne(userId);

  res.send();
}));

export default router;