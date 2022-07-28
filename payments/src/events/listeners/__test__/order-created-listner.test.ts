import { OrderCreatedListener } from '../order-created-listener';
import { natsClient } from '../../../app';
import { OrderCreatedEvent, OrderStatus } from '@dellticketing/common';
import { createId } from '../../../utils';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models';

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent['data'] = {
    id: createId(),
    version: 0,
    expiresAt: 'created time string',
    userId: createId(),
    status: OrderStatus.CREATED,
    ticket: {
      id: createId(),
      price: 10
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message };
};

describe('Test order created listener', () => {
  test('should replicate the order info', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    const order = await Order.findById(data.id);

    expect(data.id).toEqual(order!.id);
    expect(data.status).toEqual(order!.status);

  });

  test('should ack the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);
    expect(message.ack).toHaveBeenCalled();
  });
});
