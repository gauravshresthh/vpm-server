import { Request, Response, NextFunction } from 'express';

const userAgentBlock = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const blacklistedUserAgents = [
    'sqlmap',
    'nmap',
    'nikto',
    'dirbuster',
    'acunetix',
    'wpscan',
    'burp suite',
    'owaspzap',
    'masscan',
    'whatweb',
  ];

  const userAgent = req.headers['user-agent'] || '';
  if (
    blacklistedUserAgents.some((agent) =>
      userAgent.toLowerCase().includes(agent)
    )
  ) {
    res.status(403).send('Access Denied');
    return;
  }

  next();
};

export default userAgentBlock;
