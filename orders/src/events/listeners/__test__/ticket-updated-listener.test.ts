import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsClient } from '../../../app';
import { createId, createTicket } from '../../../utils';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@dellticketing/common';
import { Ticket, TicketDocument } from '../../../models';

const setup = async (): Promise<{ listener: TicketUpdatedListener, data: TicketCreatedEvent['data'], message: Message, ticket: TicketDocument }> => {
  const listener = new TicketUpdatedListener(natsClient.client);
  const ticket = await createTicket();
  const data: TicketCreatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'Title #2',
    price: 100,
    userId: createId()
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};
describe('Ticket updated listener', () => {
  test('should finds, update and saves a ticket', async () => {
    const { listener, data, message, ticket } = await setup();
    await listener.onMessage(data, message);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });
  test('should does not call ack if the event has a skipped version number', async () => {
    const { listener, data, message, ticket } = await setup();
    data.version = 10;
    try {
      await listener.onMessage(data, message);
    } catch (err) {
    }

    expect(message.ack).not.toHaveBeenCalled();

  });

  test('should ack the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    expect(message.ack).toHaveBeenCalled();
  });
});
