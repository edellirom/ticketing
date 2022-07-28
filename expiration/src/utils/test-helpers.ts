import { app } from '../app';
import { Ticket, TicketAttrs } from '../models';
import supertest from 'supertest';
import { createId } from './helpers';

const url = '/api/orders';

export async function createTicket(attrs: TicketAttrs = { id: createId(), title: 'Title#1', price: 5 }) {
  const ticket = Ticket.build(attrs);
  return ticket.save();
};

export const postRequest = (cookie: string[], ticketId: string) => {
  return supertest(app)
    .post(url)
    .set('Cookie', cookie)
    .send({ ticketId });
};

export const getRequest = (cookie: string[]) => {
  return supertest(app)
    .get(url)
    .set('Cookie', cookie);
};

export const getOneRequest = (cookie: string[], id: string) => {
  return supertest(app)
    .get(`${url}/${id}`)
    .set('Cookie', cookie);
};

export const deleteOneRequest = (cookie: string[], id: string) => {
  return supertest(app)
    .delete(`${url}/${id}`)
    .set('Cookie', cookie);
};
