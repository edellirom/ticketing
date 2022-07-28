import request from 'supertest';
import { app } from '../../app/app';

const url = '/api/tickets';
const title = 'title';
const price = 10;
const createTicket = () => {
  return request(app).post(url).set('Cookie', global.signin()).send({ title, price }).expect(201);
};

describe(`Route GET ${url}`, () => {
  test('should return a fetch of tickets', async () => {
    await createTicket();
    await createTicket();

    const response = await request(app).get(`${url}`).send().expect(200);
    expect(response.body.length).toEqual(2)
    expect(response.body[0].title).toEqual(title);
    expect(response.body[0].price).toEqual(price);
  });
});
