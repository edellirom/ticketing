import express, { Request, Response } from 'express';
import 'express-async-errors';
import { currentUser, errorHandler, NotFoundError } from '@dellticketing/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from '../routes/new';
import { showTicketRouter } from '../routes/show';
import { indexTicketRouter } from '../routes';
import { updateTicketRouter } from '../routes/update';
require('dotenv').config();

const app = express();

app.disable('X-Powered-By');
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);
app.all('*', async (request: Request, response: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
