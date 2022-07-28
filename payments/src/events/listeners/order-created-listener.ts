import { Listener, OrderCreatedEvent, Subjects } from '@dellticketing/common';
import { queueGroupName } from '../queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const { id, status, userId, ticket, version } = data;
    if (!userId) {
      throw new Error('userId required');
    }
    if (!ticket) {
      throw new Error('ticket required');
    }
    const order = Order.build({
      id,
      status,
      userId,
      version,
      price: ticket.price
    });
    await order.save();

    message.ack();
  }
}
