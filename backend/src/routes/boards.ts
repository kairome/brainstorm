import express from 'express';
import db from '@/db';
import { JwtRequest } from '@/types/auth';
import { BadRequestException, ForbiddenException, ValidationException } from '@/exceptions';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';
import { BoardDoc } from '@/types/boards';
import { UserDoc } from '@/types/user';
import { validateEmail, validatePublicBoardPermissions } from '@/utils/validations';

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

const verifyBoardAndUser = (user: UserDoc | null, board: BoardDoc | null) => {
  if (!user) {
    return new BadRequestException({ message: 'User not found' });
  }

  if (!board) {
    return new BadRequestException({ message: 'Board not found' });
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

  const { isFavorite, board, search } = req.query;

  const ownBoardDocs = await db.boardsCrud.getByAuthor(userId, search as string);
  const invitedBoardIds = _.map(user.invitedBoards, b => b.boardId);
  const sharedBoardDocs = await db.boardsCrud.getSharedBoards(invitedBoardIds, search as string);

  const ownBoards = _.map(ownBoardDocs, b => ({ ...b, isFavorite: _.includes(user.favoriteBoards, String(b._id)) }));
  const sharedBoards = _.map(sharedBoardDocs, b => ({
    ...b,
    isFavorite: _.includes(user.favoriteBoards, String(b._id))
  }));

  const isFavFilter = isFavorite === 'true';

  const filteredMyBoards = _.filter(ownBoards, b => isFavFilter ? b.isFavorite : true);
  const filteredSharedBoards = _.filter(sharedBoards, b => isFavFilter ? b.isFavorite : true);

  if (board === 'my') {
    res.json(filteredMyBoards);
    return;
  }

  if (board === 'shared') {
    res.json(filteredSharedBoards);
    return;
  }

  res.json(_.concat(filteredMyBoards, filteredSharedBoards));
}));

router.get('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const board = await db.boardsCrud.getOneById(req.params.id, { projection: { snapshot: 0 } });
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
  res.status(204).send();
}));

router.post('/:id/favorite', asyncHandler(async (req: JwtRequest, res) => {
  const boardId = req.params.id;
  const userId = req.auth!.userId;

  const user = await db.userCrud.getUserById(userId);
  const board = await db.boardsCrud.getOneById(boardId);

  const exception = verifyBoardAndUser(user, board);

  if (exception) {
    return exception.throw(res);
  }

  const adding = !_.includes(user!.favoriteBoards ?? [], boardId);

  await db.userCrud.setBoardFavorite(userId, boardId, adding);
  res.status(201).send();
}));

router.post('/:id/invite', asyncHandler(async (req: JwtRequest, res) => {
  const boardId = req.params.id;
  const userId = req.auth!.userId;

  const board = await db.boardsCrud.getOneById(boardId);

  const exception = verifyBoardAndOwner(userId, board);

  if (exception) {
    return exception.throw(res);
  }

  const { email, canEdit } = req.body;
  const { errors } = await validateEmail(email);

  if (errors) {
    return new BadRequestException({ message: 'Invalid email' }).throw(res);
  }

  const invitedUser = await db.userCrud.getUserByEmail(email);
  if (!invitedUser) {
    console.info('Send invitation to user');
  } else {
    await db.userCrud.addBoard(String(invitedUser._id), { boardId, canEdit });
  }

  res.status(201).send();

}));

router.patch('/:id/public-perms', asyncHandler(async (req: JwtRequest, res) => {
  const boardId = req.params.id;
  const userId = req.auth!.userId;

  const board = await db.boardsCrud.getOneById(boardId);

  const exception = verifyBoardAndOwner(userId, board);

  if (exception) {
    return exception.throw(res);
  }

  const { errors, data } = await validatePublicBoardPermissions(req.body);

  if (errors) {
    return new ValidationException(errors).throw(res);
  }

  if (!data) {
    return new BadRequestException({ message: 'Something went wrong' }).throw(res);
  }

  if ((!data.anonUsers.canView && data.anonUsers.canEdit) || (!data.registeredUsers.canView && data.registeredUsers.canEdit)) {
    return new BadRequestException({ message: 'Incompatible permissions: users must also be able to view if they can edit the board' }).throw(res);
  }

  await db.boardsCrud.setPublicBoardPerms(boardId, data);

  res.status(200).send();
}));

router.get('/public/:publicId', asyncHandler(async (req, res) => {
  const board = await db.boardsCrud.getBoardByPublicId(req.params.publicId);

  res.json(board);
}));

export default router;