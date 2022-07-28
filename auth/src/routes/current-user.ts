import { Router, Request, Response } from 'express';
import { currentUser, requireAuth } from '@dellticketing/common';

const router = Router();

const getCurrentUser = (request: Request, response: Response) => {
  response.status(200).json({ currentUser: request.currentUser || null });
};

router.get('/api/users/current-user', currentUser, requireAuth, getCurrentUser);

export { router as currentUserRouter };
