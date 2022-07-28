import { createTicket, deleteOneRequest, postRequest } from '../../utils';
import { Order, OrderStatus } from '../../models';
import { natsClient } from '../../app';

describe('Test delete endpoint', () => {
  test('should marks an order as cancelled', async () => {
    const user = global.signin();
    const ticket = await createTicket();
    const { body: order } = await postRequest(user, ticket.id).expect(201);
    await deleteOneRequest(user, order.id).expect(204);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
  });

  test('should emits an order cancelled event', async () => {
    const { id: ticketId } = await createTicket();
    const cookie = global.signin();
    const { body: order } = await postRequest(cookie, ticketId).expect(201);
    await deleteOneRequest(cookie, order.id).expect(204);
    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
