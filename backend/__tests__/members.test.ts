import { generateToken } from '../src/utils/auth';
// @ts-ignore
import request from 'supertest';
import app from '../src/app';

const testEmail = 'test@test.com';
const testUserId = '123';

const token = generateToken(testEmail, testUserId);
const removeMemberFromBoardsMock = jest.fn();
const updateBoardMemberPermsMock = jest.fn();
jest.mock('../src/db', () => {
  return {
    userCrud: {
    },
    boardsCrud: {
      removeMemberFromBoards: (...args: any) => removeMemberFromBoardsMock(...args),
      updateBoardMemberPerms: (...args: any) => updateBoardMemberPermsMock(...args),
    },
  };
});
describe('Board members', () => {
  test('Update board permissions with incorrect payload', async () => {
    const res = await request(app).patch('/api/members/board-permissions').send({}).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(2);

    const res1 = await request(app).patch('/api/members/board-permissions').send({
      email: 'some@email.com',
      boards: [],
    }).set('Authorization', `Bearer ${token}`);
    expect(res1.status).toEqual(400);
    expect(res1.body).toHaveProperty('errors');
    expect(res1.body.errors).toHaveLength(1);
  });

  test('Update member boards permissions', async () => {
    const res = await request(app).patch('/api/members/board-permissions').send({
      email: 'some@email.com',
      boards: [
        {
          boardId: 'board1',
          canEdit: false,
          removed: true,
        },
        {
          boardId: 'board2',
          canEdit: false,
          removed: false,
        },
        {
          boardId: 'board3',
          canEdit: false,
          removed: true,
        },
        {
          boardId: 'board4',
          canEdit: true,
          removed: false,
        },
      ],
    }).set('Authorization', `Bearer ${token}`);
    expect(removeMemberFromBoardsMock).toHaveBeenCalledWith(testUserId, 'some@email.com', ['board1', 'board3']);
    expect(updateBoardMemberPermsMock).toHaveBeenCalledWith(testUserId, 'board2', 'some@email.com', false);
    expect(updateBoardMemberPermsMock).toHaveBeenCalledWith(testUserId, 'board4', 'some@email.com', true);
    expect(updateBoardMemberPermsMock).toHaveBeenCalledTimes(2);
    expect(res.status).toEqual(200);
  });
});