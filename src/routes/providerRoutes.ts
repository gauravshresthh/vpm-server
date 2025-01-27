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
  authorize(['system-admin']),
  checkPermissions('college-management', 'create'),
  sanitize(createProviderValidationSchema),
  providerController.create
);

router.get(
  '/',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-management', 'read'),
  providerController.findAll
);

export default router;
