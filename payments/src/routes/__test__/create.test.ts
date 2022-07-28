import supertest from 'supertest';
import { OrderStatus } from '@dellticketing/common';
import { app, stripe } from '../../app';
import { createId } from '../../utils';
import { Order, OrderAttrs, Payment } from '../../models';

function postRequest(
  {
    payload = {
      token: 'some-token',
      orderId: createId()
    },
    cookie = global.signin(),
    url = '/api/payments'
  }: {
    payload?: { token: string, orderId: string },
    cookie?: string[],
    url?: string
  } = {}
) {
  return supertest(app).post(url).set('Cookie', cookie).send(payload);
}

async function createOrder(payload: OrderAttrs = {
  id: createId(),
  userId: createId(),
  version: 0,
  price: 20,
  status: OrderStatus.CREATED
}) {
  const order = await Order.build(payload);
  return order.save();
}

describe('Test create payment', () => {
  test('should return a 404 whet purchasing an order that does not exist', async () => {
    await postRequest().expect(404);
  });

  test('should return 401 when purchasing an order that does not belong to the user', async () => {
    const order = await createOrder();
    await postRequest({
      payload: {
        orderId: order.id,
        token: 'some-token'
      }
    }).expect(401);
  });

  test('should return 400 when purchasing a cancelled order', async () => {
    const userId = createId();
    const order = await createOrder({
      id: createId(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.CANCELLED
    });
    await postRequest({
      cookie: global.signin(userId),
      payload: { orderId: order.id, token: 'some-token' }
    }).expect(400);

  });

  test('should return a 201 with valid inputs', async () => {
    const userId = createId();
    const order = await createOrder({
      id: createId(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.CREATED
    });
    const { body: charge } = await postRequest({
      cookie: global.signin(userId),
      payload: {
        token: 'tok_visa',
        orderId: order.id
      }
    }).expect(201);
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.currency).toEqual('usd');
    expect(chargeOptions.amount).toEqual(20 * 100);
    const payment = await Payment.findOne({ orderId: order.id, stripeId: charge!.id });
    expect(payment).not.toBeNull();
  });
});
