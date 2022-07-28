import { createTicket, getOneRequest, postRequest } from '../../utils';

describe('Test show orders', () => {
  test('should fetch the order', async () => {
    const user = global.signin();
    const ticket = await createTicket();
    const { body: order } = await postRequest(user, ticket.id).expect(201);
    const { body: fetchOrder } = await getOneRequest(user, order.id).expect(200);
    expect(fetchOrder.id).toEqual(order.id);
  });

  test('should return an error if one user tries to fetch another users order', async () => {
    const user = global.signin();
    const anotherUser = global.signin();
    const ticket = await createTicket();
    const { body: order } = await postRequest(user, ticket.id).expect(201);
    await getOneRequest(anotherUser, order.id).expect(401);
  });
});