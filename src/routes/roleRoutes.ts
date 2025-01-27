import { Router, Request, Response } from 'express';
import { authorize } from '../middlewares/authorize';
import { authenticate } from '../middlewares/authenticate';
import checkPermissions from '../middlewares/checkPermissions';
import roleController from '../controllers/roleController';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(['system-admin']),
  authorize(['system-admin']),
  checkPermissions('role-management', 'read'),
  roleController.findAll
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
  '/vpo',
  authenticate,
  authorize(['vpo', 'system-admin']),
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
