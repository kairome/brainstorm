import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { BadRequestException, ForbiddenException } from '@/exceptions';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';

const router = express.Router();

router.post('', asyncHandler(async (req: JwtRequest, res) => {
  const newBoard = await db.boardsCrud.create({
    title: 'Untitled',
    author: req.auth!.userId,
  });
  res.send(newBoard.insertedId);
}));

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  const boards = await db.boardsCrud.getByAuthor(req.auth!.userId);
  res.json(boards);
}));

router.get('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const board = await db.boardsCrud.getOneById(req.params.id);
  res.json(board);
}));

router.patch('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const { title, customThumbnail } = req.body;

  if (!title && _.isNil(customThumbnail)) {
    return new BadRequestException({ message: 'Not enough fields supplied.' }).throw(res);
  }

  const boardId = req.params.id;

  const board = await db.boardsCrud.getOneById(boardId);

  if (!board) {
    return new BadRequestException({ message: 'Board not found' }).throw(res);
  }

  if (req.auth!.userId !== board.author) {
    return new ForbiddenException('Only board author can edit the board').throw(res);
  }

  const user = await db.userCrud.getUserById(req.auth!.userId);

  if (!user) {
    return new BadRequestException({ message: 'User not found' }).throw(res);
  }

  const modifiedBy = user.name ?? user.email;

  if (title) {
    await db.boardsCrud.setTitle(boardId, title, modifiedBy);
  }

  if (!_.isNil(customThumbnail)) {
    await db.boardsCrud.setCustomThumbnail(boardId, customThumbnail, modifiedBy);
  }

  res.status(201).send();
}));

export default router;