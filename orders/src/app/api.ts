import express, { Router } from 'express';
import { getOrderRouter, showOrderRouter, createOrderRouter, deleteOrderRouter } from '../routes';

export const routes = (): Router => {
  const router = express.Router();

  router.use('/orders', getOrderRouter);
  router.use('/orders', showOrderRouter);
  router.use('/orders', createOrderRouter);
  router.use('/orders', deleteOrderRouter);

  return router;
};
