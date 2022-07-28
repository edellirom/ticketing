import { Ticket, TicketAttrs } from '../models';
import { createId } from './helpers';

export async function createTicket(attrs: TicketAttrs = { title: 'Title#1', price: 5, userId: createId() }) {
  const ticket = Ticket.build(attrs);
  return ticket.save();
};

export async function findTicketById(id: string) {
  return Ticket.findById(id);
}
