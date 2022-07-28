import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@dellticketing/common';
import { queueGroupName } from '../queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { OrderCancelledPublisher } from '../publishers';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;

  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.COMPLETE) {
      message.ack();
    }

    order.set({
      status: OrderStatus.CANCELLED
    });

    await order.save();

    const publisher = new OrderCancelledPublisher(this.client);
    await publisher.publish({
      id: order.id,
      status: order.status,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price
      }
    });

    message.ack();
  }
}
