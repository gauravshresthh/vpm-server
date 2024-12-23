import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import superAdminController from '../controllers/superAdminController';
import sanitize from '../middlewares/sanitize';
import { createUserValidationSchema } from '../validations/superAdminValidation';
import checkPermissions from '../middlewares/checkPermissions';

const router = Router();

router.post(
  '/create-user',
  authenticate,
  authorize(['super-admin']),
  sanitize(createUserValidationSchema),
  superAdminController.createUser
);

router.get(
  '/college-settings',
  authenticate,
  authorize(['super-admin']),
  checkPermissions('college-settings', 'read'),
  (req, res) => {
    res.send('Accessed College Settings');
  }
);

export default router;
