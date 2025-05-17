import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import CustomError from '../utils/CustomError';
import { IRole } from '../models/roleModel';

const checkPermissions =
  (feature: string, action: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userFromRequest = req.user as { id: string } | undefined;

      if (!userFromRequest) {
        return next(new CustomError('User is not authenticated', 401));
      }

      // Populate the single role
      const user = await User.findById(userFromRequest.id).populate('role');
      if (!user || !user.role) {
        return next(new CustomError('User or role not found', 404));
      }

      const role = user.role as unknown as IRole;

      const allowedActions = role.permissions.get(feature);

      if (allowedActions?.includes('all') || allowedActions?.includes(action)) {
        return next();
      }

      return next(
        new CustomError(
          `Access denied: '${action}' permission on '${feature}'`,
          403
        )
      );
    } catch (error) {
      console.error(error);
      next(new CustomError('Internal server error', 500));
    }
  };

export default checkPermissions;