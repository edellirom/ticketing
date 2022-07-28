import express, { Request, Response } from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { errorHandler, NotFoundError } from '@dellticketing/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (request: Request, response: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
