import { Listener, PaymentCreatedEvent, Subjects } from '@dellticketing/common';
import { queueGroupName } from '../queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../models';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    const order = await Order.findOne({ id: data.orderId });
    if (!order) {
      throw  new Error('Order not found');
    }
    order.set({
      status: OrderStatus.COMPLETE
    });
    await order.save();

    message.ack();
  }
}
