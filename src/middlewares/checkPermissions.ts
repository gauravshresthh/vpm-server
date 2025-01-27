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

      const user = await User.findById(userFromRequest.id).populate('roles');
      if (!user) {
        return next(new CustomError('User not found', 404));
      }

      const roles = user.roles as unknown as IRole[]; // User now has multiple roles
      if (!roles || roles.length === 0) {
        return next(new CustomError('No roles assigned to the user', 403));
      }

      // Check permissions across all assigned roles
      for (const role of roles) {
        const allowedActions = role.permissions.get(feature);

        // Grant access if any role has 'all' access
        if (allowedActions?.includes('all')) {
          return next();
        }

        // Grant access if any role allows the specific action
        if (allowedActions?.includes(action)) {
          return next();
        }
      }

      // If no roles grant the required permission
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
