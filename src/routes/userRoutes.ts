import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import userController from '../controllers/userController';
import sanitize from '../middlewares/sanitize';
import {
  deleteMultipleUserByIdsSchema,
  getAllUsersValidationSchema,
  getAnalyticsSchema,
  getUserByIdValidationSchema,
  updateUserByIdValidationSchema,
} from '../validations/userValidation';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get(
  '/',
  authenticate,
  authenticate,
  authorize(['system-admin']),
  sanitize(getAllUsersValidationSchema),
  userController.findAll
);

router.get(
  '/user/:user_id',
  authenticate,
  authenticate,
  authorize(['system-admin']),
  sanitize(getUserByIdValidationSchema),
  userController.findById
);

router.put(
  '/user/:user_id',
  authenticate,
  authenticate,
  authorize(['system-admin']),
  sanitize(updateUserByIdValidationSchema),
  userController.updateById
);

router.delete(
  '/',
  authenticate,
  authenticate,
  authorize(['system-admin']),
  sanitize(deleteMultipleUserByIdsSchema),
  userController.deleteMultipleByIds
);

router.get(
  '/dashboard',
  authenticate,
  authenticate,
  authorize(['system-admin']),
  sanitize(getAnalyticsSchema),
  userController.getUserAnalytics
);

export default router;
