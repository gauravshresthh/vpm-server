/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';

// Define the info type for Passport authentication responses
interface AuthInfo {
  success: boolean;
  message: string;
  error?: string;
}

// Authenticate local strategy
export const authenticateLocal = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'local',
    (err: Error | null, user: any, info: AuthInfo | undefined) => {
      if (err) {
        return next(
          new CustomError('An error occurred during authentication.', 500)
        );
      }
      if (!user) {
        return next(new CustomError(err || 'You are unauthorized.', 403));
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

// Authenticate JWT strategy
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: any, info: AuthInfo | undefined) => {
      if (err) {
        return next(
          new CustomError('An error occurred during authentication.', 500)
        );
      }
      if (!user) {
        return next(new CustomError(err || 'You are unauthorized.', 403));
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
