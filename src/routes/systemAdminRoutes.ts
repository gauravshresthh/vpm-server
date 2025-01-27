import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import systemAdminController from '../controllers/systemAdminController';
import sanitize from '../middlewares/sanitize';
import { createUserValidationSchema } from '../validations/systemAdminValidation';
import checkPermissions from '../middlewares/checkPermissions';

const router = Router();

router.post(
  '/create-user',
  authenticate,
  authorize(['system-admin']),
  sanitize(createUserValidationSchema),
  systemAdminController.createUser
);

router.get(
  '/college-settings',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-settings', 'read'),
  (req, res) => {
    res.send('Accessed College Settings');
  }
);

export default router;
