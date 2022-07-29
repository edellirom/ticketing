import mongoose from 'mongoose';
import { app, natsClient } from './app';
import {
  ExpirationCompleteListener,
  PaymentCreatedListener,
  TicketCreatedListener,
  TicketUpdatedListener
} from './events/listeners';

const start = async () => {
  console.log('Starting up orders microservice...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
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
    await natsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsClient.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsClient.client.close());
    process.on('SIGTERM', () => natsClient.client.close());

    new TicketCreatedListener(natsClient.client).listen();
    new TicketUpdatedListener(natsClient.client).listen();
    new ExpirationCompleteListener(natsClient.client).listen();
    new PaymentCreatedListener(natsClient.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start().catch((error) => {
  console.error(error);
});
