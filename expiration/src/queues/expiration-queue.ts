import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { getNats } from '../app';

interface Payload {
  orderId: string;

}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) => {
  const publisher = new ExpirationCompletePublisher(getNats.client);
  await publisher.publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
