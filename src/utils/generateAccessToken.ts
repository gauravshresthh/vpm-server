import { config } from '../config/config';
import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string, roles: string): string => {
  return jwt.sign({ id: userId, roles }, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiry, // Access token expires in 15 minutes
  });
};

export default generateAccessToken;
