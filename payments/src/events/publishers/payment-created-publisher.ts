import { PaymentCreatedEvent, Publisher, Subjects } from '@dellticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
