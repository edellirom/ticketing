import { createTicket, findTicketById } from '../../utils/test-helpers';
import DoneCallback = jest.DoneCallback;

describe('Test Ticket model', () => {
  test('should implements optimistic concurrency control', async () => {
    const ticket = await createTicket();
    const firstTicketInstance = await findTicketById(ticket.id);
    const secondTicketInstance = await findTicketById(ticket.id);

    firstTicketInstance!.set({ price: 10 });
    secondTicketInstance!.set({ price: 15 });

    await firstTicketInstance!.save();
    try {
      await secondTicketInstance!.save();
    } catch (error) {
      return;
    }
    throw new Error('Should not reach this point');
  });

  test('should increments the version number on multiple saves', async () => {
    const ticket = await createTicket();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});


