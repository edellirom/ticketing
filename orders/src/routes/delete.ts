import { NotAuthorizedError, NotFoundError, requireAuth } from '@dellticketing/common';
import { Request, Response, Router } from 'express';
import { Order, OrderStatus } from '../models';
import { OrderCancelledPublisher } from '../events';
import { natsClient } from '../app';

const router = Router();

const handler = async (request: Request, response: Response) => {
  const { orderId } = request.params;
  const order = await Order.findById(orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.CANCELLED;
  await order.save();

  const { id, status, userId, ticket, version } = order;

  const natsPublisher = new OrderCancelledPublisher(natsClient.client);
  await natsPublisher.publish({
    id,
    status,
    userId,
    version,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  });

  response.status(204).json(order);
};

router.delete('/:orderId', requireAuth, handler);

export { router as deleteOrderRouter };
