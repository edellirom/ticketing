import request from 'supertest';
import { app } from '../../app';

describe('Signup testing', () => {
  const signupUri = '/api/users/signup';
  const validUserDTO = {
    email: 'test@test.com',
    password: 'password',
  };

  it('should returns a 201 on successful signup', async function () {
    return request(app).post(signupUri).send(validUserDTO).expect(201);
  });

  it('should return a 400 with an invalid email', async function () {
    return request(app)
      .post(signupUri)
      .send({
        email: 'testtest.com',
        password: 'password',
      })
      .expect(400);
  });

  it('should return a 400 with invalid password', async function () {
    return request(app)
      .post(signupUri)
      .send({
        email: 'testtest.com',
        password: 'p',
      })
      .expect(400);
  });

  it('should return a 400 with missing email and password', async function () {
    await request(app).post(signupUri).send({ email: 'test@test.com' }).expect(400);
    return request(app).post(signupUri).send({ password: 'password' }).expect(400);
  });

  it('should disallows duplicate emails', async function () {
    await request(app).post(signupUri).send(validUserDTO).expect(201);
    return request(app).post(signupUri).send(validUserDTO).expect(400);
  });

  it('should sets a cookie after successful signup', async function () {
    const response = await request(app).post(signupUri).send(validUserDTO).expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
