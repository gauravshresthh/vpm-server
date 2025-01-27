/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import { User } from '../models/userModel';

export const authorize = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check if the user is attached to the request
      const userFromRequest = req.user as { id: string } | undefined;
      if (!userFromRequest) {
        return next(new CustomError('User is not authenticated', 401));
      }

      // Fetch the user and their associated roles
      const user = await User.findById(userFromRequest.id).populate('roles');
      if (!user) {
        return next(new CustomError('User not found', 404));
      }

      // Ensure the user has at least one of the allowed roles
      const hasAccess = user.roles.some((role: any) =>
        allowedRoles.includes(role.name)
      );
      if (!hasAccess) {
        return next(new CustomError('Forbidden: You do not have access', 403));
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return next(new CustomError('Internal Server Error', 500));
    }
  };
};
