import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import systemAdminController from '../controllers/systemAdminController';
import sanitize from '../middlewares/sanitize';
import {
  createUserValidationSchema,
  editUserByIdValidationSchema,
  resetPasswordValidationSchema,
} from '../validations/systemAdminValidation';
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

router.post(
  '/reset-password',
  authenticate,
  authorize(['system-admin']),
  sanitize(resetPasswordValidationSchema),
  systemAdminController.resetUserPassword
);

router.put(
  '/edit-user/:user_id',
  authenticate,
  authorize(['system-admin']),
  sanitize(editUserByIdValidationSchema),
  systemAdminController.editUserById
);

export default router;
