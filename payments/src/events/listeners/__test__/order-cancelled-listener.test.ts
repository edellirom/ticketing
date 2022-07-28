import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsClient } from '../../../app';
import { Order } from '../../../models';
import { createId } from '../../../utils';
import { OrderCancelledEvent, OrderStatus } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const order = await Order.build({
    id: createId(),
    userId: createId(),
    status: OrderStatus.CANCELLED,
    price: 10,
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    status: OrderStatus.CANCELLED
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, order, data, message };
};
describe('Test order canceled listener', () => {
  test('should update the status of the order', async () => {
    const { listener, order, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);

  });

  test('should ack the message', async () => {
    const { listener, order, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
