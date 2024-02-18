import express from 'express';
import { JwtRequest } from '@/types/auth';

const router = express.Router();
import { UploadedFile } from 'express-fileupload';
import { BadRequestException } from '@/exceptions';
import { FileBuckets } from '@/types/files';
import { filesContainer } from '@/config';
import db from '@/db';
import asyncHandler from 'express-async-handler';
import fs from 'fs';

router.post('/boards/:boardId/thumbnail', asyncHandler(async (req: JwtRequest, res) => {
  if (!req.files) {
    return new BadRequestException({ message: 'Thumbnail is not present.' }).throw(res);
  }

  const boardId = req.params.boardId;
  const board = await db.boardsCrud.getOneById(boardId);

  if (!board) {
    return new BadRequestException({ message: 'Board not found' }).throw(res);
  }

  if (req.auth!.userId !== board.author) {
    return new BadRequestException({ message: 'Only board authors can set thumbnails', code: 403 }).throw(res);
  }

  const file = req.files.thumbnail as UploadedFile;

  if (file.mimetype !== 'image/png') {
    return new BadRequestException({ message: 'Unsupported file format' }).throw(res);
  }

  const fileName = `${board._id}.png`;

  try {
    const filePath = `${filesContainer}/${FileBuckets.BoardThumbnails}/${fileName}`;
    await file.mv(filePath);
    await db.boardsCrud.setCustomThumbnail(board._id, true);
    res.status(201).send();
  } catch (err) {
    return new BadRequestException({ message: `Failed to upload the file: ${err}`, code: 500 }).throw(res);
  }
}));

router.get('/boards/:boardId/thumbnail', asyncHandler(async (req: JwtRequest, res) => {
  const boardId = req.params.boardId;
  const board = await db.boardsCrud.getOneById(boardId);

  if (!board) {
    return new BadRequestException({ message: 'Board not found' }).throw(res);
  }

  const thumbnailPath = `${filesContainer}/${FileBuckets.BoardThumbnails}/${board._id}.png`;

  if (!fs.existsSync(thumbnailPath)) {
    res.status(200).send(null);
    return;
  }

  const file = await fs.promises.readFile(thumbnailPath);
  res.send('data:image/png;base64,' + file.toString('base64'));
}));

export default router;