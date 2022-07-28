import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

const show = async (request: Request, response: Response) => {
  const { id } = request.params;
  const ticket = await Ticket.findById(id);
  ticket ? response.status(200).json(ticket) : response.status(404).send([]);
};

router.get('/api/tickets/:id', show);

export { router as showTicketRouter };
