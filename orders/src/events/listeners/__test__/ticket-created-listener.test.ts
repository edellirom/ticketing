import { TicketCreatedEvent } from '@dellticketing/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsClient } from '../../../app';
import { createId } from '../../../utils';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';
import e from 'express';

const setup = async (): Promise<{ listener: TicketCreatedListener, data: TicketCreatedEvent['data'], message: Message }> => {
  const listener = new TicketCreatedListener(natsClient.client);
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: createId(),
    title: 'Title #1',
    price: 10,
    userId: createId()
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };
  return { listener, data, message };
};

describe('Ticket created listener', () => {

  test('should creates and saves a ticket', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  test('should ack the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    expect(message.ack).toHaveBeenCalled();
  });
});
