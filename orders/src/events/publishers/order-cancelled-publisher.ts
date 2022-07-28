import { Subjects, Publisher, OrderCancelledEvent } from '@dellticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
