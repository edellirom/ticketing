import { Listener, OrderCancelledEvent, Subjects } from '@dellticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from '../queue-group-name';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], message: Message) {
    if (!data.ticket) {
      throw new Error('Ticket does not received');
    }

    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    const { id, orderId, userId, price, title, version } = ticket;

    const publisher = new TicketUpdatedPublisher(this.client);
    await publisher.publish({ id, orderId, userId, price, title, version });

    message.ack();
  }

}
