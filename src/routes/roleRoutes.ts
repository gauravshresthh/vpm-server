import { Router, Request, Response } from 'express';
import { authorize } from '../middlewares/authorize';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(['super-admin']),
  (_req: Request, res: Response) => {
    res.send('Super Admin Access');
  }
);

router.get(
  '/super-admin',
  authenticate,
  authorize(['super-admin']),
  (_req: Request, res: Response) => {
    res.send('Super Admin Access');
  }
);

router.get(
  '/vpo',
  authenticate,
  authorize(['vpo', 'super-admin']),
  (_req: Request, res: Response) => {
    res.send('VPO Access');
  }
);

router.get(
  '/system-admin',
  authenticate,
  authorize(['system-admin']),
  (_req: Request, res: Response) => {
    res.send('System Admin Access');
  }
);

router.get(
  '/college-admin',
  authenticate,
  authorize(['college-admin']),
  (_req: Request, res: Response) => {
    res.send('College Admin Access');
  }
);

router.get(
  '/facilitator',
  authenticate,
  authorize(['facilitator']),
  (_req: Request, res: Response) => {
    res.send('Facilitator Access');
  }
);

router.get(
  '/trainer',
  authenticate,
  authorize(['trainer']),
  (_req: Request, res: Response) => {
    res.send('Trainer Access');
  }
);

router.get(
  '/student',
  authenticate,
  authorize(['student']),
  (_req: Request, res: Response) => {
    res.send('Student Access');
  }
);

export default router;
