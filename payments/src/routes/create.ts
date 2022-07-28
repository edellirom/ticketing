import { Request, Response, Router } from 'express';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError, OrderStatus
} from '@dellticketing/common';
import { body } from 'express-validator';
import { Order, Payment } from '../models';
import { natsClient, stripe } from '../app';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = Router();

const validation = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty()
];

const handler = async (request: Request, response: Response) => {
  const { token, orderId } = request.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestError('Cannot pay for an cancelled order');
  }

  const paymentPayload = {
    amount: order.price * 100,
    currency: 'usd',
    source: token,
    description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)'
  };
  const charge = await stripe.charges.create(paymentPayload);

  const payment = await Payment.build({
    orderId,
    stripeId: charge.id
  });
  await payment.save();

  const publisher = new PaymentCreatedPublisher(natsClient.client);
  await publisher.publish({
    id: payment.id,
    orderId: payment.orderId,
    paymentId: payment.stripeId
  });

  response.status(201).json(charge);
};

router.post('/', requireAuth, validation, validateRequest, handler);

export { router as createPaymentRouter };
;
