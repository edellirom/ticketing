import { OrderCreatedListener } from '../order-created-listener';
import { natsClient } from '../../../app';
import { createTicket } from '../../../utils/test-helpers';
import { OrderCreatedEvent, OrderStatus } from '@dellticketing/common';
import { createId } from '../../../utils';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDocument } from '../../../models';

const setup = async (): Promise<{ listener: OrderCreatedListener, data: OrderCreatedEvent['data'], ticket: TicketDocument, message: Message }> => {
  const listener = new OrderCreatedListener(natsClient.client);

  const ticket = await createTicket();

  const data: OrderCreatedEvent['data'] = {
    id: createId(),
    version: 0,
    status: OrderStatus.CREATED,
    userId: createId(),
    expiresAt: 'fds',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};

describe('Test order created listener', () => {
  test('should sets the userId of the ticket', async () => {
    const { listener, data, message, ticket } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  test('should  ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  test('should publish a ticket updated event', async () => {
    const { listener, data, message, ticket } = await setup();

    await listener.onMessage(data, message);

    expect(natsClient.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
  });
});
