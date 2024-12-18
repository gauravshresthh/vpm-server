import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get('/super-admin', authenticate(['super-admin']), (_req: Request, res: Response): void => {
  res.send('Super Admin Access');
});

router.get('/vpo', authenticate(['VPO']), (_req: Request, res: Response): void => {
  res.send('VPO Access');
});

router.get('/system-admin', authenticate(['System admin']), (_req: Request, res: Response): void => {
  res.send('System Admin Access');
});

router.get('/college-admin', authenticate(['college admin']), (_req: Request, res: Response): void => {
  res.send('College Admin Access');
});

router.get('/facilitator', authenticate(['facilitator']), (_req: Request, res: Response): void => {
  res.send('Facilitator Access');
});

router.get('/trainer', authenticate(['trainer']), (_req: Request, res: Response): void => {
  res.send('Trainer Access');
});

router.get('/student', authenticate(['student']), (_req: Request, res: Response): void => {
  res.send('Student Access');
});

export default router;
