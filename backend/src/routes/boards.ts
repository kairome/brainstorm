import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { BadRequestException } from '@/exceptions';
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

  if (title) {
    await db.boardsCrud.setTitle(boardId, title);
  }

  if (!_.isNil(customThumbnail)) {
    await db.boardsCrud.setCustomThumbnail(boardId, customThumbnail);
  }

  res.status(201).send();
}));

export default router;