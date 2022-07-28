import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@dellticketing/common';
import jwt from 'jsonwebtoken';
import config from '../config';

const router = Router();

const signUpValidation = () => {
  return [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ];
};

const signUp = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email in use');
  }
  const user = User.build({ email, password });

  await user.save();
  //Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.JWT_KEY
  );
  //Store it on session object
  request.session = {
    jwt: userJwt,
  };
  return response.status(201).json(user);
};

router.post('/api/users/signup', signUpValidation(), validateRequest, signUp);

export { router as signUpRouter };
