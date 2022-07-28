import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

// declare global {
//   var getSigningCookie: () => Promise<string[]>;
// }

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testsercret';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// global.getSigningCookie = async () => {
//   const validUser = {
//     email: 'test@gmail.com',
//     password: 'password',
//   };
//
//   const response = await request(app).post('/api/users/signup').send(validUser).expect(201);
//   const cookie = response.get('Set-Cookie');
//   return cookie;
// };
