import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { BadRequestException, ForbiddenException } from '@/exceptions';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';
import { BoardDoc } from '@/types/boards';

const router = express.Router();

const verifyBoardAndOwner = (userId: string, board: BoardDoc | null) => {
  if (!board) {
    return new BadRequestException({ message: 'Board not found' });
  }

  if (board.author !== userId) {
    return new ForbiddenException('You are not the board\'s author!');
  }

  return null;
};

router.post('', asyncHandler(async (req: JwtRequest, res) => {
  const newBoard = await db.boardsCrud.create({
    title: 'Untitled',
    author: req.auth!.userId,
  });
  res.send(newBoard.insertedId);
}));

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const user = await db.userCrud.getUserById(userId);

  if (!user) {
    return new BadRequestException({ message: 'User not found' }).throw(res);
  }

  const ownBoards = await db.boardsCrud.getByAuthor(userId);
  const sharedBoards = _.isEmpty(user.boards) ? [] : await db.boardsCrud.getSharedBoards(user.boards);
  res.json(_.concat(ownBoards, sharedBoards));
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
  const userId = req.auth!.userId;

  const board = await db.boardsCrud.getOneById(boardId);

  const exception = verifyBoardAndOwner(userId, board);

  if (exception !== null) {
    return exception.throw(res);
  }

  const user = await db.userCrud.getUserById(userId);

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

router.delete('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const boardId = req.params.id;
  const userId = req.auth!.userId;
  const board = await db.boardsCrud.getOneById(boardId);

  const exception = verifyBoardAndOwner(userId, board);

  if (exception !== null) {
    return exception.throw(res);
  }

  await db.boardsCrud.deleteOne(boardId);
  res.status(201).send();
}));

export default router;