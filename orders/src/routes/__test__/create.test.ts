import { natsClient } from '../../app';
import { createId, createTicket, postRequest } from '../../utils';
import { Order } from '../../models';
import { OrderStatus } from '@dellticketing/common';

describe('Test new order creation', () => {
  test('should return an error if the ticket does not exist', async () => {
    const cookie = global.signin();
    const ticketId = createId();
    await postRequest(cookie, ticketId).expect(404);
  });

  test('should return an error if the ticket is already reserved', async () => {
    const cookie = global.signin();
    const ticket = await createTicket();
    const order = Order.build({
      ticket,
      userId: '62a0290d7c0aa4aa9e61767e',
      status: OrderStatus.CREATED,
      expiresAt: new Date
    });
    await order.save();
    await postRequest(cookie, ticket.id).expect(400);
  });

  test('should reserves a ticket', async () => {
    const cookie = global.signin();
    const ticket = await createTicket();
    await postRequest(cookie, ticket.id).expect(201);
  });

  test('should emits an order created event', async () => {
    const cookie = global.signin();
    const ticket = await createTicket();
    await postRequest(cookie, ticket.id).expect(201);
    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
