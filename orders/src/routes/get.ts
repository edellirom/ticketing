import { Request, Response, Router } from 'express';
import { requireAuth } from '@dellticketing/common';
import { Order } from '../models';

const router = Router();

const handler = async (request: Request, response: Response) => {
  const orders = await Order.find({
    userId: request.currentUser!.id
  }).populate('ticket');

  response.status(200).json(orders);
};

router.get('/', requireAuth, handler);

export { router as getOrderRouter };
