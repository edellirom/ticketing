import { Listener, OrderCreatedEvent, Subjects } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from '../queue-group-name';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    if (!data.ticket) {
      throw new Error('Ticket does not received');
    }

    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    const { id, price, title, userId, orderId, version } = ticket;

    const publisher = new TicketUpdatedPublisher(this.client);
    await publisher.publish({
      id, price, title, userId, orderId, version
    });

    message.ack();
  }
}
