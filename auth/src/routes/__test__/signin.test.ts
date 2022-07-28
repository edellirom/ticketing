import request from 'supertest';
import { app } from '../../app';

describe('Signin testing', () => {
  const signinUri = '/api/users/signin';
  const signupUri = '/api/users/signup';

  const validUserDTO = {
    email: 'test@test.com',
    password: 'password',
  };

  it('should returns a 200 on successful signin if email exist', async function () {
    await request(app).post(signupUri).send(validUserDTO).expect(201);
    await request(app).post(signinUri).send(validUserDTO).expect(200);
  });

  it('should fails when an email that does not exist is supplied', async function () {
    await request(app).post(signinUri).send(validUserDTO).expect(400);
  });

  it('should fails when ad incorrect password is supplied', async function () {
    await request(app).post(signupUri).send(validUserDTO).expect(201);
    await request(app).post(signinUri).send({ email: 'test@test.com', password: 'e3fdsfsdfds3' }).expect(400);
  });
  it('should responds a cookie when given valid credentials', async function () {
    await request(app).post(signupUri).send(validUserDTO).expect(201);
    const response = await request(app).post(signinUri).send(validUserDTO).expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
