import mongoose from 'mongoose';
import { Request, Response, Router } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@dellticketing/common';
import { body } from 'express-validator';
import { Order, Ticket, TicketDocument } from '../models';
import { OrderCreatedPublisher } from '../events/publishers';
import { natsClient } from '../app';

const router = Router();

const validation = [
  body('ticketId')
    .not().isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket must be defined')
];

const handler = async (request: Request, response: Response) => {
  const { ticketId } = request.body;

  const ticket = await findTicketTryingToOrderById(ticketId);

  await checkTicketReserved(ticket);

  const expirationTime = getExpirationTime();

  const order = await saveOrder(request.currentUser!.id, OrderStatus.CREATED, expirationTime, ticket);

  const { id, status, userId, version } = order;

  const natsPublisher = new OrderCreatedPublisher(natsClient.client);
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

  response.status(201).json(order);
};

/**
 * Find the ticket the user is trying to order in the database;
 */
async function findTicketTryingToOrderById(ticketId: string): Promise<TicketDocument> {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }
  return ticket;
}

/**
 * Make sure that this ticket is not already reserved
 */
async function checkTicketReserved(ticket: TicketDocument): Promise<void> {
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }
}


/**
 * Calculate an expiration date of this order
 */
const EXPIRATION_WINDOW_TIME = 1 * 60;

function getExpirationTime(): Date {
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_TIME);
  return expiration;
}

/**
 * Build the order and save it to the database
 */
async function saveOrder(userId: string, status: OrderStatus, expiresAt: Date, ticket: TicketDocument) {
  const order = Order.build({
    userId, status, expiresAt, ticket
  });
  const result = await order.save();
  return result;
}

/**
 * Publish an event saying that an order was created
 */

router.post('/', requireAuth, validation, validateRequest, handler);

export { router as createOrderRouter };
