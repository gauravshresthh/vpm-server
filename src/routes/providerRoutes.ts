import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import sanitize from '../middlewares/sanitize';
import checkPermissions from '../middlewares/checkPermissions';
import providerController from '../controllers/providerController';
import {
  createProviderValidationSchema,
  deleteProviderByIdValidationSchema,
  getAllProviderValidationSchema,
  getProviderByIdValidationSchema,
  updateProviderValidationSchema,
} from '../validations/providerValidation';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(['system-admin']),
  sanitize(getAllProviderValidationSchema),
  // checkPermissions('college-management', 'read'),
  providerController.findAll
);

router.get(
  '/:provider_id',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-management', 'read'),
  sanitize(getProviderByIdValidationSchema),
  providerController.findById
);

router.post(
  '/',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-management', 'create'),
  sanitize(createProviderValidationSchema),
  providerController.create
);

router.put(
  '/:provider_id',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-management', 'update'),
  sanitize(updateProviderValidationSchema),
  providerController.updateById
);

router.delete(
  '/:provider_id',
  authenticate,
  authorize(['system-admin']),
  checkPermissions('college-management', 'delete'),
  sanitize(deleteProviderByIdValidationSchema),
  providerController.deleteById
);

export default router;
