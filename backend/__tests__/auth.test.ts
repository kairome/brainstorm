import app from '../src/app';
// @ts-ignore
import request from 'supertest';
// @ts-ignore
import bcrypt from 'bcrypt';

const userGetOne = jest.fn();
const createUser = jest.fn();
const updateInvitedUserInfo = jest.fn();

createUser.mockResolvedValue({ insertedId: '123' });

jest.mock('../src/db', () => {
  return {
    userCrud: {
      getOne: () => userGetOne(),
      getUserByEmail: () => userGetOne(),
      createUser: (data: any) => createUser(data),
    },
    boardsCrud: {
      updateInvitedUserInfo: (...args: any) => updateInvitedUserInfo(...args)
    },
  };
});

describe('Login', () => {
  test('Incorrect payload', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(2);
  });

  test('User does not exist', async () => {
    userGetOne.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: '123' });
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ 'message': 'Wrong email or password' });
  });

  test('User exists, wrong password', async () => {
    userGetOne.mockResolvedValue({
      email: 'test@test.com',
      passwordHash: '123',
    });
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: '123' });
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ 'message': 'Wrong email or password' });
  });

  test('User can login', async () => {
    const hash = await bcrypt.hash('123', 10);
    userGetOne.mockResolvedValue({
      email: 'test@test.com',
      passwordHash: hash,
    });
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: '123' });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Register', () => {
  test('Wrong payload', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(3);
  });

  test('User already exists', async () => {
    userGetOne.mockResolvedValue({
      email: 'some@some.com',
    });
    const res = await request(app).post('/api/auth/register').send({
      email: 'some@some.com',
      password: '12345678',
      name: 'Name',
    });
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ message: 'Email is invalid' });
  });

  test('User can register', async () => {
    userGetOne.mockResolvedValue(null);
    const payload = {
      email: 'some@some.com',
      password: '12345678',
      name: 'Name',
    };
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({ email: payload.email, name: payload.name }));
    expect(updateInvitedUserInfo).toHaveBeenCalledWith(payload.email, '123', payload.name);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});