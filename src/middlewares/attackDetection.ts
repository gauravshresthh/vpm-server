import { Request, Response, NextFunction } from 'express';

const attackPatterns = [
  /union.*select/i,
  /<script>/i,
  /exec\s*\(/i,
  /cmd.exe/i,
  /nmap/i,
];

const containsAttackPattern = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return attackPatterns.some((pattern) => pattern.test(value));
  }
  return false;
};

const attackDetection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  for (const key in req.query) {
    if (containsAttackPattern(req.query[key])) {
      res.status(403).send('Blocked for security reasons.');
      return;
    }
  }

  for (const key in req.body) {
    if (containsAttackPattern(req.body[key])) {
      res.status(403).send('Blocked for security reasons.');
      return;
    }
  }

  next();
};

export default attackDetection;
