import request from 'supertest';
import { app } from '../../app/app';
import { createId } from '../../utils';

const url = '/api/tickets';
const id = createId();

describe(`Route GET ${url}:id`, () => {
  test('should return a 404 status if the ticket is not found', async () => {
    await request(app).get(`${url}/${id}`).send().expect(404);
  });

  test('should return the ticket if it was found', async () => {
    const title = 'title';
    const price = 10;

    const response = await request(app).post(url).set('Cookie', global.signin()).send({ title, price }).expect(201);
    const ticketResponse = await request(app).get(`${url}/${response.body.id}`).send().expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
