import { Request, Response, NextFunction } from "express";

const failedAttempts = new Map<string, number[]>();

const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip ?? "unknown-ip";
  const now = Date.now();

  if (!failedAttempts.has(ip)) {
    failedAttempts.set(ip, []);
  }

  const attempts = failedAttempts.get(ip)!;
  attempts.push(now);

  while (attempts.length > 0 && now - attempts[0] > 60000) {
    attempts.shift();
  }

  if (attempts.length > 10) {
    res.status(429).send("Too many requests. Try again later.");
    return;
  }

  next();
};

export default rateLimiter;
