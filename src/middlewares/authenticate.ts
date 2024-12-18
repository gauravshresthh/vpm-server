import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const authenticate = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret) as { role: string };
      if (!roles.includes(payload.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      // Attach user info to request if needed
      (req as Request).user = payload;
      next();
    } catch (err: unknown) {
      console.log(err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
