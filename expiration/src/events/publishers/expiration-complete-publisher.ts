import { ExpirationCompleteEvent, Publisher, Subjects } from '@dellticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;

}
