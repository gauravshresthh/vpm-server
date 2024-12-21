import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as { role: string };

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: You do not have access.`,
      });
      return;
    }

    next();
  };
};
