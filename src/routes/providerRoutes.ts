import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import sanitize from '../middlewares/sanitize';
import checkPermissions from '../middlewares/checkPermissions';
import providerController from '../controllers/providerController';
import { createProviderValidationSchema } from '../validations/providerValidation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['super-admin']),
  checkPermissions('college-management', 'write'),
  sanitize(createProviderValidationSchema),
  providerController.create
);

router.get(
  '/',
  authenticate,
  authorize(['super-admin']),
  checkPermissions('college-management', 'read'),
  providerController.findAll
);

export default router;
