import request from 'supertest';
import { app } from '../../app';

describe('Signout testing', () => {
  const signupUri = '/api/users/signup';
  const signoutUri = '/api/users/signout';
  const validUserDto = {
    email: 'test@gmail.com',
    password: 'password',
  };

  it('should clears the cookie after signing out ', async function () {
    await request(app).post(signupUri).send(validUserDto).expect(201);
    const response = await request(app).post(signoutUri).send({}).expect(200);
    expect(response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
  });
});
