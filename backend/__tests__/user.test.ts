import { generateToken } from '../src/utils/auth';
// @ts-ignore
import request from 'supertest';
import app from '../src/app';
// @ts-ignore
import bcrypt from 'bcrypt';

const testEmail = 'test@test.com';
const testUserId = '123';

const token = generateToken(testEmail, testUserId);
const getUserByIdMock = jest.fn();
const updateUserInfoMock = jest.fn();
const updateBoardMemberNameMock = jest.fn();
const updateUserPassHashMock = jest.fn();

const deleteUserMock = jest.fn();

const removeAuthorBoardsMock = jest.fn();
const removeMemberFromAllBoardsMock = jest.fn();
const removeAllOwnerTemplatesMock = jest.fn();

getUserByIdMock.mockResolvedValue({
  _id: testUserId,
  email: testEmail,
});
jest.mock('../src/db', () => {
  return {
    userCrud: {
      getUserById: (id: string) => getUserByIdMock(id),
      updateUserInfo: (...args: any) => updateUserInfoMock(...args),
      updateUserPassHash: (...args: any) => updateUserPassHashMock(...args),
      deleteOne: (id: string) => deleteUserMock(id),
    },
    boardsCrud: {
      updateBoardMemberName: (...args: any) => updateBoardMemberNameMock(...args),
      removeAuthorBoards: (...args: any) => removeAuthorBoardsMock(...args),
      removeMemberFromAllBoards: (...args: any) => removeMemberFromAllBoardsMock(...args),
    },
    templatesCrud: {
      removeAllOwnerTemplates: (...args: any) => removeAllOwnerTemplatesMock(...args),
    }
  };
});
describe('User', () => {
  test('Update user with wrong payload', async () => {
    const res = await request(app).patch('/api/user').send({}).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ message: 'Name or color must be present' });
  });

  test('Update user color', async () => {
    const color = '#fff';
    const res = await request(app).patch('/api/user').send({ color }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(getUserByIdMock).toHaveBeenCalledWith(testUserId);
    expect(updateUserInfoMock).toHaveBeenCalledWith(testUserId, { color });
    expect(updateBoardMemberNameMock).toHaveBeenCalledTimes(0);
  });
  test('Update user name', async () => {
    const name = 'New name';
    const res = await request(app).patch('/api/user').send({ name }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(getUserByIdMock).toHaveBeenCalledWith(testUserId);
    expect(updateUserInfoMock).toHaveBeenCalledWith(testUserId, { name });
    expect(updateBoardMemberNameMock).toHaveBeenCalledWith(testEmail, name);
  });
  test('Update user password with incorrect current password', async () => {
    const hash = await bcrypt.hash('123', 10);
    getUserByIdMock.mockResolvedValue({
      _id: testUserId,
      email: testEmail,
      passwordHash: hash,
    });

    const res = await request(app).patch('/api/user/password').send({
      currentPassword: 'pass',
      newPassword: 'pass'
    }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ message: 'Password is incorrect' });
  });

  test('Update user password', async () => {
    const hash = await bcrypt.hash('pass', 10);
    getUserByIdMock.mockResolvedValue({
      _id: testUserId,
      email: testEmail,
      passwordHash: hash,
    });

    const res = await request(app).patch('/api/user/password').send({
      currentPassword: 'pass',
      newPassword: 'new-pass123'
    }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(updateUserPassHashMock).toHaveBeenCalledTimes(1);
    expect(updateUserPassHashMock.mock.calls[0]).toHaveLength(2);
  });

  test('Remove user', async () => {
    const hash = await bcrypt.hash('pass', 10);
    getUserByIdMock.mockResolvedValue({
      _id: testUserId,
      email: testEmail,
      passwordHash: hash,
    });

    const res = await request(app).post('/api/user/remove').send({
      password: 'pass',
    }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(removeAuthorBoardsMock).toHaveBeenCalledWith(testUserId);
    expect(removeMemberFromAllBoardsMock).toHaveBeenCalledWith(testEmail);
    expect(removeAllOwnerTemplatesMock).toHaveBeenCalledWith(testUserId);
    expect(deleteUserMock).toHaveBeenCalledWith(testUserId);
  });
});