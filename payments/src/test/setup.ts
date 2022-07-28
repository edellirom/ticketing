import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createId } from '../utils';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../app/nats-client');
jest.mock('../app/stripe');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testsercret';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || createId(),
    email: 'test@test.com'
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
