import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@dellticketing/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import config from '../config';

const router = Router();

const signInValidation = () => {
  return [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ];
};

const signIn = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('User is not exist');
  }
  const passwordMath = await Password.compare(existingUser.password, password);
  if (!passwordMath) {
    throw new BadRequestError('Invalid credentials');
  }
  //Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    config.JWT_KEY
  );
  //Store it on session object
  request.session = {
    jwt: userJwt,
  };
  return response.status(200).json(existingUser);
};

router.post('/api/users/signin', signInValidation(), validateRequest, signIn);

export { router as signInRouter };
