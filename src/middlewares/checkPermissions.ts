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

      const user = await User.findById(userFromRequest.id).populate('role');
      if (!user) {
        return next(new CustomError('User not found', 404));
      }

      const role = user.role as unknown as IRole | null;
      if (!role) {
        return next(new CustomError('Role not assigned to the user', 403));
      }

      const allowedActions = role.permissions.get(feature);

      // Check if the role has 'all' access
      if (allowedActions?.includes('all')) {
        return next();
      }

      // Check if the specific action is allowed
      if (!allowedActions || !allowedActions.includes(action)) {
        return next(
          new CustomError(
            `Access denied: '${action}' permission on '${feature}'`,
            403
          )
        );
      }

      next();
    } catch (error) {
      console.log(error);
      next(new CustomError('Internal server error', 500));
    }
  };

export default checkPermissions;
