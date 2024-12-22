/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

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
        return res.status(500).json({
          success: false,
          message: 'An error occurred during authentication',
          error: err.message,
        });
      }
      if (!user) {
        return res.status(400).json(info);
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
        return res.status(500).json({
          success: false,
          message: 'An error occurred during authentication',
          error: err.message,
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: err || info,
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
