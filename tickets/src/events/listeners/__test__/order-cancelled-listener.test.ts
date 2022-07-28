import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsClient } from '../../../app';
import { createId } from '../../../utils';
import { Ticket } from '../../../models';
import { OrderCancelledEvent, OrderStatus } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);
  const orderId = createId();
  const ticket = await Ticket.build({ title: 'Title#2', price: 20, userId: createId() });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    status: OrderStatus.CANCELLED,
    expiresAt: 'expire',
    userId: createId(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { message, data, listener, ticket, orderId };

};
describe('Test order cancelled listener', () => {
  test('should update the ticket, publish an event, and ack the message', async () => {
    const { message, data, listener, ticket, orderId } = await setup();
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(message.ack).toHaveBeenCalled();
    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
