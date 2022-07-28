import request from 'supertest';
import { app } from '../../app';

describe('Testing current-user route', () => {
  const signupUri = '/api/users/signup';
  const currentUserUri = '/api/users/current-user';
  const validUserDTO = {
    email: 'test@gmail.com',
    password: 'password',
  };
  it('should responds with details about current user ', async function () {
    const authResponse = await request(app).post(signupUri).send(validUserDTO).expect(201);
    const cookie = authResponse.get('Set-Cookie');
    // const cookie = global.getSigningCookie()
    const response = await request(app).get(currentUserUri).set('Cookie', cookie).send().expect(200);
    expect(response.body.currentUser.email).toEqual(validUserDTO.email);
  });
  it('should responds with null if not authenticated', async function () {
    const response = await request(app).get(currentUserUri).send().expect(401);
  });
});
