import { getNats } from './app';
import { OrderCreatedListener } from './events/listeners';

const start = async () => {
  console.log('Starting up orders microservice....');

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {
    await getNats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    getNats.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => getNats.client.close());
    process.on('SIGTERM', () => getNats.client.close());

    new OrderCreatedListener(getNats.client).listen();

  } catch (error) {
    console.error(error);
  }
};

start().catch((error) => {
  console.error(error);
});
