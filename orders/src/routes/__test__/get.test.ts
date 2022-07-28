import { createTicket, postRequest, getRequest } from '../../utils';

const url = '/api/orders';

describe(`GET ${url}`, () => {
  describe('Test get orders', () => {
    test('should fetch orders fro an particular user', async () => {
      const ticketOne = await createTicket();
      const ticketTwo = await createTicket();
      const ticketThree = await createTicket();

      const userOne = global.signin();
      const userTwo = global.signin();

      await postRequest(userOne, ticketOne.id).expect(201);
      const { body: orderOne } = await postRequest(userTwo, ticketTwo.id).expect(201);
      const { body: orderTwo } = await postRequest(userTwo, ticketThree.id).expect(201);

      const { body } = await getRequest(userTwo).expect(200);

      expect(body.length).toEqual(2);
      expect(body[0].id).toEqual(orderOne.id);
      expect(body[1].id).toEqual(orderTwo.id);
      expect(body[0].ticket.id).toEqual(ticketTwo.id);
      expect(body[1].ticket.id).toEqual(ticketThree.id);
    });
  });
});

