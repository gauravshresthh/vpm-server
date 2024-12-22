import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import superAdminController from '../controllers/superAdminController';
import sanitize from '../middlewares/sanitize';
import { createUserValidationSchema } from '../validations/superAdminValidation';

const router = Router();

router.post(
  '/create-user',
  authenticate,
  authorize(['super-admin']),
  sanitize(createUserValidationSchema),
  superAdminController.createUser
);

export default router;
