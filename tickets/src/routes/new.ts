import { Request, Response, Router } from 'express';
import { requireAuth, validateRequest } from '@dellticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers';
import { natsClient } from '../app';

const router: Router = Router();

const createValidation = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
];

const createController = async (request: Request, response: Response) => {
  const { title, price } = request.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: request.currentUser!.id
  });

  await ticket.save();

  await new TicketCreatedPublisher(natsClient.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  response.status(201).json(ticket);
};

router.post('/api/tickets', requireAuth, createValidation, validateRequest, createController);

export { router as createTicketRouter };
