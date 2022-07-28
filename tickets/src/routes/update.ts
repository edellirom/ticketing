import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError
} from '@dellticketing/common';
import { Ticket } from '../models';
import { natsClient } from '../app';
import { TicketUpdatedPublisher } from '../events/publishers';

const router = Router();

const validation = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
];


const update = async (request: Request, response: Response) => {
  const { id } = request.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError('Ticket is reserved');
  }

  if (ticket.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  ticket.set(request.body);

  await ticket.save();

  await new TicketUpdatedPublisher(natsClient.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  response.status(200).send(ticket);
};

router.put('/api/tickets/:id', requireAuth, validation, validateRequest, update);

export { router as updateTicketRouter };
