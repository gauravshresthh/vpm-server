import { Router, Request, Response } from 'express';
import passport from 'passport';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get(
  '/super-admin',
  passport.authenticate('jwt', { session: false }),
  authorize(['super-admin']),
  (_req: Request, res: Response) => {
    res.send('Super Admin Access');
  }
);

router.get(
  '/vpo',
  passport.authenticate('jwt', { session: false }),
  authorize(['VPO']),
  (_req: Request, res: Response) => {
    res.send('VPO Access');
  }
);

router.get(
  '/system-admin',
  passport.authenticate('jwt', { session: false }),
  authorize(['System admin']),
  (_req: Request, res: Response) => {
    res.send('System Admin Access');
  }
);

router.get(
  '/college-admin',
  passport.authenticate('jwt', { session: false }),
  authorize(['college admin']),
  (_req: Request, res: Response) => {
    res.send('College Admin Access');
  }
);

router.get(
  '/facilitator',
  passport.authenticate('jwt', { session: false }),
  authorize(['facilitator']),
  (_req: Request, res: Response) => {
    res.send('Facilitator Access');
  }
);

router.get(
  '/trainer',
  passport.authenticate('jwt', { session: false }),
  authorize(['trainer']),
  (_req: Request, res: Response) => {
    res.send('Trainer Access');
  }
);

router.get(
  '/student',
  passport.authenticate('jwt', { session: false }),
  authorize(['student']),
  (_req: Request, res: Response) => {
    res.send('Student Access');
  }
);

export default router;
