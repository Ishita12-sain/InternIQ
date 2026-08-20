import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config/env';
import { JWTPayload } from '../types/user.types';

export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwtSecret as Secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret as Secret) as JWTPayload;
};
