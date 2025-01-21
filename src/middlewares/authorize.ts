/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import { User } from '../models/userModel';

export const authorize = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userFromRequest = req.user as { id: string } | undefined;

      if (!userFromRequest) {
        return next(new CustomError('User is not authenticated', 401));
      }
      const user: any = await User.findById(userFromRequest.id).populate(
        'role'
      );
      if (!user) {
        return next(new CustomError('User not found', 404));
      }
      if (!user || !roles.includes(user.role.name)) {
        return next(new CustomError(`Forbidden: You do not have access.`, 401));
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new CustomError('Authorization Failed', 500));
    }
  };
};
