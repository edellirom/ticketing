import { Publisher, Subjects, TicketUpdatedEvent } from '@dellticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}