import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

const index = async (request: Request, response: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined
  });
  response.status(200).json(tickets);
};

router.get('/api/tickets', index);

export { router as indexTicketRouter };
