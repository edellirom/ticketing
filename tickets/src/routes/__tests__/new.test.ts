import request from 'supertest';
import { app } from '../../app/app';
import { Ticket } from '../../models/ticket';
import { natsClient } from '../../app';

const url = '/api/tickets';

describe(`Route POST ${url}`, () => {

  test('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app).post(url).send({});
    expect(response.status).not.toEqual(404);
  });

  test('should olnly be accessed if the user is signed in', async () => {
    const response = await request(app).post(url).send({});
    expect(response.status).toEqual(401);
  });

  test('should return a status other than 401 if the user is signed in', async () => {
    const response = await request(app).post(url).set('Cookie', global.signin()).send({});
    expect(response.status).not.toEqual(401);
  });

  test('should return an error if an invalid title is provided ', async () => {
    await request(app).post(url).set('Cookie', global.signin()).send({ title: '', price: 10 }).expect(400);
  });

  test('should return an error if title undefined', async () => {
    await request(app).post(url).set('Cookie', global.signin()).send({ price: 10 }).expect(400);
  });

  test('should return an error if price is negative', async () => {
    await request(app).post(url).set('Cookie', global.signin()).send({ title: 'title', price: -10 }).expect(400);
  });

  test('should return an error if price undefined', async () => {
    await request(app).post(url).set('Cookie', global.signin()).send({ title: 'title' }).expect(400);
  });

  test('should create a ticket with valid inputs', async () => {
    const title = 'title';
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app).post(url).set('Cookie', global.signin()).send({ title, price: 10 }).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual('title');
  });

  test('should publishing an event', async () => {
    const title = 'title';
    await request(app).post(url).set('Cookie', global.signin()).send({ title, price: 10 }).expect(201);
    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
