import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsClient } from '../../../app';
import { createId, createTicket } from '../../../utils';
import { Order } from '../../../models';
import { ExpirationCompleteEvent, OrderStatus } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsClient.client);
  const ticket = await createTicket();

  const order = Order.build({
    status: OrderStatus.CREATED,
    userId: createId(),
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, data, message };
};
describe('Test expiration complete listener', () => {
  test('should update the order status to cancelled', async () => {
    const { listener, ticket, order, data, message } = await setup();
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
  });

  test('should emit an OrderCancelled event', async () => {
    const { listener, ticket, order, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsClient.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
  });

  test('should ack the message', async () => {
    const { listener, ticket, order, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

});
