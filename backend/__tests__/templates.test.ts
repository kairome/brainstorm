import { generateToken } from '../src/utils/auth';
// @ts-ignore
import request from 'supertest';
import app from '../src/app';
import boardSnapshot from '../src/utils/boardSnapshot';

const testEmail = 'test@test.com';
const testUserId = '123';

const token = generateToken(testEmail, testUserId);

const createFromSnapshotMock = jest.fn();
const getUserByIdMock = jest.fn();
const getBoardByIdMock = jest.fn();

getUserByIdMock.mockResolvedValue({
  _id: testUserId,
  email: testEmail,
});

jest.mock('../src/db', () => {
  return {
    userCrud: {
      getUserById: (id: string) => getUserByIdMock(id),
    },
    boardsCrud: {
      getOneById: (id: string) => getBoardByIdMock(id),
    },
    templatesCrud: {
      createFromSnapshot: (...args: any) => createFromSnapshotMock(...args),
    },
  };
});

describe('Templates', () => {
  beforeEach(() => {
    createFromSnapshotMock.mockResolvedValue({ insertedId: 'template1' });
  });

  afterEach(() => {
    createFromSnapshotMock.mockReset();
    getBoardByIdMock.mockReset();
  });
  test('Create new template', async () => {
    const res = await request(app).post('/api/templates').send({}).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(createFromSnapshotMock).toHaveBeenCalledWith(testUserId, 'New', boardSnapshot);
    expect(res.text).toEqual('template1');
  });

  test('Create template from board', async () => {
    const snapshot = {
      test: 'test',
    };
    getBoardByIdMock.mockResolvedValue({
      _id: 'board1',
      title: 'Board 1',
      snapshot: snapshot,
      author: testUserId,
    });
    const res = await request(app).post('/api/templates').send({ boardId: 'board1' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(getBoardByIdMock).toHaveBeenCalledWith('board1');
    expect(createFromSnapshotMock).toHaveBeenCalledWith(testUserId, 'Board 1', snapshot);
    expect(res.text).toEqual('template1');
  });

  test('Create template from not owned board', async () => {
    getBoardByIdMock.mockResolvedValue({
      _id: 'board1',
      title: 'Board 1',
      snapshot: {},
      author: 'someAuthor',
    });

    const res = await request(app).post('/api/templates').send({ boardId: 'board1' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(403);
    expect(res.body).toEqual({ message: 'Only board authors or invited members can create templates' });
  });
});