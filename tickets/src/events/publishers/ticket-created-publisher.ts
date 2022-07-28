import { Publisher, Subjects, TicketCreatedEvent } from '@dellticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
