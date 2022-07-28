import request from 'supertest';
import { app } from '../../app/app';
import { createId } from '../../utils';
import { TicketPayload } from '../../types';
import { natsClient } from '../../app';
import { Ticket } from '../../models';

const url = '/api/tickets';
const id = createId();
const payload: TicketPayload = {
  title: 'title',
  price: 10
};

const createTicket = (payload: TicketPayload, cookie: string[]) => {
  return request(app).post(url).set('Cookie', cookie).send(payload).expect(201);
};

const updateTicket = (id: string, payload: TicketPayload, cookie: string[], status: number) => {
  return request(app).put(`${url}/${id}`).set('Cookie', cookie).send(payload).expect(status);
};

describe(`Route PUT ${url}:id`, () => {
  test('should return a 404 status if the provided id does not exist', async () => {
    await updateTicket(id, payload, global.signin(), 404);
  });

  test('should return a 401 status if the user is not authenticated', async () => {
    request(app).put(`${url}/${id}`).send(payload).expect(401);
  });

  test('should return a 401 status if the user does not own the ticket', async () => {
    const response = await createTicket(payload, global.signin());
    await updateTicket(response.body.id, { title: 'title', price: 40 }, global.signin(), 401);
  });

  test('should return a 400 status if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await createTicket(payload, cookie);
    const { id } = response.body;
    await updateTicket(id, { title: '', price: 10 }, cookie, 400);
    await updateTicket(id, { title: 'Title', price: -10 }, cookie, 400);
  });

  test('should updates the ticket provided valid inputs', async () => {
    const newPayload: TicketPayload = { title: 'New title', price: 100 };
    const cookie = global.signin();
    const response = await createTicket(payload, cookie);
    const { id } = response.body;
    await updateTicket(id, newPayload, cookie, 200);

    const ticketResponse = await request(app).get(`${url}/${id}`).send();
    expect(ticketResponse.body).toMatchObject(newPayload);
  });

  test('should publishing an event', async () => {
    const newPayload: TicketPayload = { title: 'New title', price: 100 };
    const cookie = global.signin();
    const response = await createTicket(payload, cookie);
    const { id } = response.body;
    await updateTicket(id, newPayload, cookie, 200);
    expect(natsClient.client.publish).toHaveBeenCalled();
  });

  test('should reject updates if the ticket is reserved', async () => {
    const newPayload: TicketPayload = { title: 'New title', price: 100 };
    const cookie = global.signin();
    const response = await createTicket(payload, cookie);
    const { id } = response.body;
    const ticket = await Ticket.findById(id);
    ticket!.set({ orderId: createId() });
    await ticket!.save();
    await updateTicket(id, newPayload, cookie, 400);
  });
});
