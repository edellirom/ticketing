import { Listener, OrderCreatedEvent, Subjects } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from '../queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    if (data.expiresAt) {
      const delay: number = new Date(data.expiresAt).getTime() - new Date().getTime();
      await expirationQueue.add({ orderId: data.id }, { delay });
      message.ack();
    }
  }
}
