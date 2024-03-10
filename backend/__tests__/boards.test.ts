import { generateToken } from '../src/utils/auth';
// @ts-ignore
import request from 'supertest';
import app from '../src/app';

const testEmail = 'test@test.com';
const testUserId = '123';

const token = generateToken(testEmail, testUserId);

const getUserByIdMock = jest.fn();
const getUserByEmailMock = jest.fn();

const getBoardsByAuthorMock = jest.fn();
const getBoardByIdMock = jest.fn();
const getSharedBoardsMock = jest.fn();
const addInvitedUserToBoardMock = jest.fn();
const setPublicBoardPermsMock = jest.fn();

getUserByIdMock.mockResolvedValue({
  _id: testUserId,
  favoriteBoards: [
    'myBoard1',
    'sharedBoard1',
  ],
});

getBoardsByAuthorMock.mockResolvedValue([
  {
    _id: 'myBoard1',
    author: testUserId,
  },
  {
    _id: 'myBoard2',
    author: testUserId,
  },
  {
    _id: 'myBoard3',
    author: testUserId,
  },
]);

getSharedBoardsMock.mockResolvedValue([
  {
    _id: 'sharedBoard1',
    author: '456',
  },
  {
    _id: 'sharedBoard2',
    author: '789',
  },
]);

getBoardByIdMock.mockResolvedValue({
  _id: 'myBoard1',
  author: testUserId,
});

jest.mock('../src/db', () => {
  return {
    userCrud: {
      getUserById: (id: string) => getUserByIdMock(id),
      getUserByEmail: (email: string) => getUserByEmailMock(email),
    },
    boardsCrud: {
      getOneById: (id: string) => getBoardByIdMock(id),
      getByAuthor: (userId: string, search: string) => getBoardsByAuthorMock(userId, search),
      getSharedBoards: (userId: string, search: string) => getSharedBoardsMock(userId, search),
      addInvitedUser: (...args: any) => addInvitedUserToBoardMock(...args),
      setPublicBoardPerms: (...args: any) => setPublicBoardPermsMock(...args),
    },
  };
});

describe('Board methods', () => {
  test('Get user boards without filters', async () => {
    const res = await request(app).get('/api/boards').set('Authorization', `Bearer ${token}`);
    expect(getUserByIdMock).toHaveBeenCalledWith(testUserId);
    expect(getBoardsByAuthorMock).toHaveBeenCalledWith(testUserId, undefined);
    expect(getSharedBoardsMock).toHaveBeenCalledWith(testUserId, undefined);
    expect(res.body).toHaveLength(5);
  });

  test('Get user boards with filters', async () => {
    const res = await request(app).get('/api/boards?search=Some&isFavorite=true').set('Authorization', `Bearer ${token}`);
    expect(getUserByIdMock).toHaveBeenCalledWith(testUserId);
    expect(getBoardsByAuthorMock).toHaveBeenCalledWith(testUserId, 'Some');
    expect(getSharedBoardsMock).toHaveBeenCalledWith(testUserId, 'Some');
    expect(res.body).toHaveLength(2);

    const res1 = await request(app).get('/api/boards?board=my&isFavorite=true').set('Authorization', `Bearer ${token}`);
    expect(res1.body).toHaveLength(1);
  });

  test('Invite user to not my own board', async () => {
    getBoardByIdMock.mockResolvedValue({ _id: 'myBoard1', author: 'some' });
    const res = await request(app).post('/api/boards/myBoard1/invite').send({ email: 'some@some.com' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(403);
    expect(res.body).toEqual({ message: 'You are not the board\'s author!' });
  });

  test('Invite user to my board', async () => {
    getBoardByIdMock.mockResolvedValue({ _id: 'myBoard1', author: testUserId });
    const email = 'some@some.com';
    getUserByEmailMock.mockResolvedValue({
      _id: 'someUser',
      email,
      name: 'Some Test'
    });

    const res = await request(app).post('/api/boards/myBoard1/invite').send({ email }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(201);
    expect(addInvitedUserToBoardMock).toHaveBeenCalledWith('myBoard1', {
      email: 'some@some.com',
      canEdit: false,
      userId: 'someUser',
      name: 'Some Test'
    });
  });

  test('Modify public permissions with incorrect payload', async () => {
    getBoardByIdMock.mockResolvedValue({ _id: 'myBoard1', author: testUserId });
    const res = await request(app).patch('/api/boards/myBoard1/public-perms').send({ }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('Modify public permissions with correct payload', async () => {
    getBoardByIdMock.mockResolvedValue({ _id: 'myBoard1', author: testUserId });
    const permsData = {
      anonUsers: {
        canEdit: false,
        canView: false,
      },
      registeredUsers: {
        canEdit: true,
        canView: true,
      },
    };
    const res = await request(app).patch('/api/boards/myBoard1/public-perms')
      .send(permsData).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(setPublicBoardPermsMock).toHaveBeenCalledWith('myBoard1', permsData);
  });
});