import express from 'express';
import asyncHandler from 'express-async-handler';
import { JwtRequest } from '@/types/auth';
import db from '@/db';
import { BadRequestException, ValidationException } from '@/exceptions';
import { validateBoardMemberPermissions } from '@/utils/validations';
import _ from 'lodash';

const router = express.Router();

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const members = await db.boardsCrud.getMembers(userId);

  res.json(members);
}));

router.post('/remove', asyncHandler(async (req: JwtRequest, res) => {
  const authUserId = req.auth!.userId;
  const { email } = req.body;

  if (!email) {
    return new BadRequestException({ message: 'Email must be present' }).throw(res);
  }

  await db.boardsCrud.removeMember(authUserId, email);
  res.send();
}));

router.patch('/board-permissions', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;

  const { errors, data } = await validateBoardMemberPermissions(req.body);

  if (errors) {
    return new ValidationException(errors).throw(res);
  }

  const removeBoards = _.reduce(data?.boards, (acc, board) => {
    if (board.removed) {
      return [...acc, board.boardId];
    }

    return acc;
  }, [] as string[]);

  if (!_.isEmpty(removeBoards)) {
    await db.boardsCrud.removeMemberFromBoards(userId, data!.email, removeBoards);
  }

  _.forEach(data?.boards, async (board) => {
    if (!board.removed) {
      await db.boardsCrud.updateBoardMemberPerms(userId, board.boardId, data?.email, board.canEdit);
    }
  });

  res.send();
}));

export default router;