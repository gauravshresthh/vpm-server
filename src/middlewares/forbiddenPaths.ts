import { Request, Response, NextFunction } from "express";

const forbiddenPaths = ["/.git", "/.env", "/node_modules"];

const forbiddenPathsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (forbiddenPaths.includes(req.path)) {
    res.status(403).send("Access Denied");
    return;
  }

  next();
};

export default forbiddenPathsMiddleware;
