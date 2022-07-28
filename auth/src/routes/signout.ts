import { Router, Request, Response } from 'express';

const router = Router();

const signOut = (request: Request, response: Response) => {
  request.session = null;
  return response.status(200).json({});
};

router.post('/api/users/signout', signOut);

export { router as signOutRouter };
