import { Request, Response, Router } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@dellticketing/common';
import { Order } from '../models';

const router = Router();

const handler = async (request: Request, response: Response) => {
  const order = await Order.findById(request.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  response.status(200).json(order);
};

router.get('/:orderId', requireAuth, handler);

export { router as showOrderRouter };
