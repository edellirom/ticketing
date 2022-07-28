import express, { Router } from 'express';
import { createPaymentRouter } from '../routes';

export const routes = (): Router => {
  const router = express.Router();

  router.use('/payments', createPaymentRouter);

  return router;
};
