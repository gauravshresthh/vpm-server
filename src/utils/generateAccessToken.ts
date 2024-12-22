import { config } from "../config/config";
import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiry, // Access token expires in 15 minutes
  });
};

export default generateAccessToken;