import express from 'express';
import asyncHandler from 'express-async-handler';
import { JwtRequest } from '@/types/auth';
import { BadRequestException, ForbiddenException } from '@/exceptions';
import db from '@/db';
import _ from 'lodash';
import boardSnapshot from '@/utils/boardSnapshot';

const router = express.Router();

const verifyTemplate = async (templateId: string, userId: string) => {
  const template = await db.templatesCrud.getOneById(templateId);
  if (!template) {
    return {
      template: null,
      exception: new BadRequestException({ message: 'Template does not exist' }),
    };
  }

  if (template.owner !== userId) {
    return {
      template: null,
      exception: new ForbiddenException('You are not the template owner!'),
    };
  }

  return {
    template,
    exception: null,
  };
};

router.post('', asyncHandler(async (req: JwtRequest, res) => {
  const { boardId } = req.body;

  const userId = req.auth!.userId;

  const user = await db.userCrud.getUserById(userId);
  if (!user) {
    return new BadRequestException({ message: 'User does not exist' }).throw(res);
  }

  if (!boardId) {
    const template = await db.templatesCrud.createFromSnapshot(userId, 'New', boardSnapshot);

    res.send(template.insertedId);
    return;
  }

  const board = await db.boardsCrud.getOneById(boardId);
  if (!board) {
    return new BadRequestException({ message: 'No such board found' }).throw(res);
  }

  const invitedUser = _.find(board.invitedUsers, u => u.userId === userId);

  if (!invitedUser && userId !== board.author) {
    return new ForbiddenException('Only board authors or invited members can create templates').throw(res);
  }

  const template = await db.templatesCrud.createFromSnapshot(userId, board.title, board.snapshot);

  res.send(template.insertedId);

}));

router.get('', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const templates = await db.templatesCrud.getByOwner(userId, req.query.search as string);

  res.json(templates);
}));

router.get('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const templateId = req.params.id;

  const { template, exception } = await verifyTemplate(templateId, userId);
  if (exception) {
    return exception.throw(res);
  }

  res.json(template);
}));

router.delete('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const templateId = req.params.id;

  const { exception } = await verifyTemplate(templateId, userId);
  if (exception) {
    return exception.throw(res);
  }

  await db.templatesCrud.deleteOne(templateId);
  res.status(200).send();
}));

router.patch('/:id', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const templateId = req.params.id;

  const { exception } = await verifyTemplate(templateId, userId);
  if (exception) {
    return exception.throw(res);
  }

  const { title, snapshot } = req.body;

  if (!title && !snapshot) {
    return new BadRequestException({ message: 'Data missing to update the template' }).throw(res);
  }

  if (title && typeof title !== 'string') {
    return new BadRequestException({ message: 'Title is incorrect' }).throw(res);
  }

  if (snapshot && typeof snapshot !== 'object') {
    return new BadRequestException({ message: 'Snapshot is incorrect' }).throw(res);
  }

  if (title) {
    await db.templatesCrud.updateTitle(templateId, title);
  }

  if (snapshot) {
    await db.templatesCrud.saveSnapshot(templateId, snapshot);
  }

  res.status(200).send();
}));

router.post('/:id/board', asyncHandler(async (req: JwtRequest, res) => {
  const userId = req.auth!.userId;
  const templateId = req.params.id;

  const { template, exception } = await verifyTemplate(templateId, userId);
  if (exception) {
    return exception.throw(res);
  }

  const newBoard = await db.boardsCrud.createFromTemplate(template);
  res.status(200).send(newBoard.insertedId);
}));

export default router;